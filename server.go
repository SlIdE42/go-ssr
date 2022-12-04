package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"flag"
	"html/template"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"time"
)

type Init struct {
	Name    string `json:"name"`
	Loading bool   `json:"loading,omitempty"`
}

func ssr(client *http.Client, url string, payload []byte) ([]byte, error) {
	resp, err := client.Post(
		url, "application/json", bytes.NewReader(payload))
	if err != nil {
		return []byte{}, err
	}
	defer resp.Body.Close()

	res, err := io.ReadAll(resp.Body)
	if err != nil {
		return []byte{}, err
	}

	if resp.StatusCode != http.StatusOK {
		return []byte{}, errors.New(string(res))
	}

	return res, nil
}

func home(client *http.Client, bundle string) http.HandlerFunc {
	tmpl, err := template.ParseFiles("src/index.html")
	if err != nil {
		log.Fatal(err)
	}

	return func(w http.ResponseWriter, r *http.Request) {
		init, _ := json.Marshal(Init{Name: r.URL.Path[1:]})
		html, err := ssr(client, "http://localhost/", init)
		if err != nil {
			html = []byte(`<div id="app"></div>`)
			log.Print(err)
		}

		err = tmpl.Execute(w, map[string]interface{}{
			"json":   template.JS(string(init)),
			"html":   template.HTML(string(html)),
			"bundle": bundle,
		})
		if err != nil {
			log.Print(err)
		}
	}
}

func client(node string) *http.Client {
	return &http.Client{
		Timeout: 50 * time.Millisecond,
		Transport: &http.Transport{
			MaxIdleConns:        100,
			MaxConnsPerHost:     100,
			MaxIdleConnsPerHost: 100,
			DialContext: func(ctx context.Context, _, _ string) (net.Conn, error) {
				if _, err := strconv.Atoi(node); err != nil {
					return (&net.Dialer{}).DialContext(ctx, "unix", node)
				}
				return (&net.Dialer{}).DialContext(ctx, "tcp", "localhost:"+node)
			},
		},
	}
}

func launch(node string, name string, arg ...string) *http.Client {
	go func() {
		failed := 0
		last := time.Now()

		for {
			cmd := exec.Command(name, arg...)
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if _, err := strconv.Atoi(node); err == nil {
				cmd.Env = []string{"PORT=" + node}
			} else {
				cmd.Env = []string{"SOCK=" + node}
			}
			log.Print(cmd.Run())

			failed += 1
			if time.Since(last) > 5*time.Second {
				last = time.Now()
				failed = 1
			}
			if failed > 2 {
				os.Exit(1)
			}
		}
	}()

	return client(node)
}

func logger(h http.Handler) http.Handler {
	encoder := json.NewEncoder(os.Stdout)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		h.ServeHTTP(w, r)
		encoder.Encode(map[string]interface{}{
			"method":      r.Method,
			"request":     r.RequestURI,
			"remote-addr": r.RemoteAddr,
			"host":        r.Host,
			"duration":    time.Since(start).String(),
			"user-agent":  r.Header.Get("User-Agent"),
			"time":        time.Now().UnixMilli(),
			"pid":         os.Getpid(),
		})
	})
}

func security(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy", "default-src 'self'; object-src 'none';")
		w.Header().Set("X-Frame-Options", "deny")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		next.ServeHTTP(w, r)
	})
}

func main() {
	library := flag.String("lib", "hyperapp", "JS library")
	node := flag.String("node", "3000", "Node port or unix socket path")
	port := flag.String("port", "8080", "Server port or unix socket path")
	flag.Parse()

	client := launch(*node, "node", *library+"/server.mjs")

	mux := http.NewServeMux()
	mux.Handle("/favicon.ico", http.FileServer(http.Dir("dist")))
	mux.Handle("/robots.txt", http.FileServer(http.Dir("dist")))
	mux.Handle("/js/", http.FileServer(http.Dir("dist")))
	mux.Handle("/", home(client, *library))

	l, err := func() (net.Listener, error) {
		if _, err := strconv.Atoi(*port); err == nil {
			return net.Listen("tcp", ":"+*port)
		}
		os.Remove(*port)
		return net.Listen("unix", *port)
	}()
	if err != nil {
		log.Fatal(err)
	}
	defer l.Close()

	log.Fatal((&http.Server{
		Handler:           security(logger(mux)),
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       10 * time.Second,
		ReadHeaderTimeout: 2 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}).Serve(l))
}

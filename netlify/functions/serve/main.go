package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"html/template"
	"io"
	"net/http"
	"os"
	"time"
)

const function = "/.netlify/functions/render/"

const index = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta name="description" content="Server-Side Rendering">
    <title>Server-Side Rendering</title>
    <script id="init" type="application/json">{{ index . "json" }}</script>
    <script src="/js/{{ index . "bundle" }}.js" async></script>
  </head>
  <body>
    <h1>Server-Side Rendering</h1>
    {{ index . "html" }}
  </body>
</html>`

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

func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	tmpl, err := template.New("index").Parse(index)
	if err != nil {
		return nil, err
	}
	client := &http.Client{Timeout: 500 * time.Millisecond}

	init, _ := json.Marshal(Init{Name: request.Path[1:]})
	html, err := ssr(client, os.Getenv("URL")+function, init)
	if err != nil {
		html = []byte(`<div id="app"></div>`)
	}

	var w bytes.Buffer
	err = tmpl.Execute(&w, map[string]interface{}{
		"json":    template.JS(string(init)),
		"html":    template.HTML(string(html)),
		"bundle": "hyperapp",
	})
	if err != nil {
		return nil, err
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       w.String(),
		Headers: map[string]string{
			"Content-Type":            "text/html; charset=UTF-8",
			"Content-Security-Policy": "default-src 'self'; object-src 'none';",
			"X-Frame-Options":         "deny",
			"X-XSS-Protection":        "1; mode=block",
			"X-Content-Type-Options":  "nosniff",
			"Referrer-Policy":         "strict-origin-when-cross-origin",
		},
	}, nil
}

func main() {
	lambda.Start(handler)
}

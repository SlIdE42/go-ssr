import { unlink } from "node:fs";
import fastify from "fastify";

const server = fastify({ logger: false });

export default function (paths) {
  Object.entries(paths).forEach(([path, handler]) =>
    server.post(path, handler)
  );

  const start = async () => {
    try {
      await server.listen(
        process.env.SOCK
          ? { path: process.env.SOCK }
          : { port: process.env.PORT || 3000 }
      );
    } catch (err) {
      if (err.code === "EADDRINUSE" && process.env.SOCK) {
        unlink(process.env.SOCK, (err) => {
          if (err) throw err;
          start();
        });
      } else {
        server.log.error(err);
        process.exit(1);
      }
    }
  };
  start();
}

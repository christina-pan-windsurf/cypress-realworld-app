import express from "express";
import createProxyMiddleware from "http-proxy-middleware";
import "dotenv/config";

export default function setupProxy(app: express.Application): void {
  app.use(
    createProxyMiddleware(["/login", "/callback", "/logout", "/checkAuth", "graphql"], {
      target: `http://localhost:${process.env.BACKEND_PORT}`,
      changeOrigin: true,
      logLevel: "debug",
    })
  );
}

import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';
import path from 'path';

/**
 * Main server file that coordinates the Vite dev server and the API Proxy.
 * 
 * Supports two modes via BACKEND_MODE environment variable:
 * 1. "mock" (default): Spawns json-server on port 5001 and proxies /api to it.
 * 2. "real": Proxies /api to the URL specified in REAL_BACKEND_URL (defaults to http://localhost:5000).
 */
async function startServer() {
  const app = express();
  const PORT = 3000;

  const backendMode = process.env.BACKEND_MODE || "mock";
  const mockPort = 5001;
  const realBackendUrl = process.env.REAL_BACKEND_URL || "http://localhost:5000";
  
  const targetUrl = backendMode === "mock" ? `http://localhost:${mockPort}` : realBackendUrl;

  console.log(`\n--- CONFIGURATION ---`);
  console.log(`Mode: ${backendMode.toUpperCase()}`);
  console.log(`Proxy Target: ${targetUrl}`);

  if (backendMode === "mock") {
    console.log(`Starting json-server on port ${mockPort}...`);
    const jsonServer = spawn('npx', ['json-server', '--watch', 'db.json', '--port', mockPort.toString(), '--host', '0.0.0.0'], {
      shell: true,
      stdio: 'inherit'
    });

    jsonServer.on('error', (err) => {
      console.error('Failed to start json-server:', err);
    });
  } else {
    console.log(`Ensuring real backend connection at ${realBackendUrl}...`);
  }

  // Proxy API requests to the selected backend
  app.use('/api', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', 
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.url} -> ${targetUrl}${req.url}`);
      },
      error: (err, req, res) => {
        console.error(`[Proxy Error] ${req.method} ${req.url} -> ${err.message}`);
      }
    }
  }));

  // Vite development middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\nServer ready!`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API:      http://localhost:${PORT}/api\n`);
  });
}

startServer();

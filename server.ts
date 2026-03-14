import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Start json-server on port 5000
  const jsonServer = spawn('npx', ['json-server', '--watch', 'db.json', '--port', '5000', '--host', '0.0.0.0'], {
    shell: true,
    stdio: 'inherit'
  });

  jsonServer.on('error', (err) => {
    console.error('Failed to start json-server:', err);
  });

  // Proxy API requests to json-server
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // remove /api prefix when forwarding to json-server
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.url}`);
      }
    }
  }));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Proxy configured: /api -> http://localhost:5000`);
  });
}

startServer();

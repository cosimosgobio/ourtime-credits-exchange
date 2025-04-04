const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3001;

app.use('/nominatim', createProxyMiddleware({
  target: 'https://nominatim.openstreetmap.org',
  changeOrigin: true,
  pathRewrite: {
    '^/nominatim': '',
  },
}));

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});

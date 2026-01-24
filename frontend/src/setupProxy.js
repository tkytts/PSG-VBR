const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy API calls (SignalR connects directly to port 5000)
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      logLevel: 'silent'
    })
  );
};

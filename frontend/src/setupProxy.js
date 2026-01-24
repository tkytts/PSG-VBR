const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy SignalR hub with WebSocket support
  app.use(
    '/api/gamehub',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      ws: true,
      logLevel: 'silent', // Suppress noisy logs
      onError: (err, req, res) => {
        // Silently ignore WebSocket errors from HMR conflicts
        if (err.code === 'ERR_STREAM_WRITE_AFTER_END') return;
        console.error('[Proxy Error]', err.message);
      }
    })
  );

  // Proxy other API calls without WebSocket
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      logLevel: 'silent'
    })
  );
};

const gatewayMiddleware = () => {
  return createProxyMiddleware({
    target: 'http://localhost:8081',
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      if (req.user) {
        // delete accessToken
        proxyReq.removeHeader('authorization');
        // set user and keyToken
        proxyReq.setHeader('user', JSON.stringify(req.user));
        proxyReq.setHeader('keyToken', JSON.stringify(req.keyToken));
      }
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
      proxyReq.end();
    },
  });
};

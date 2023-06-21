import {
  createProxyMiddleware,
  responseInterceptor,
} from 'http-proxy-middleware';

const gatewayMiddleware = ({ target }) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
      proxyReq.end();
    },
    on: {
      proxyRes: responseInterceptor(
        async (responseBuffer, proxyRes, req, res) => {
          // log complete response
          const response = responseBuffer.toString('utf8');
          console.log(response);
          return responseBuffer;
        }
      ),
    },
  });
};

export default gatewayMiddleware;

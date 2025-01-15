const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/tollguru', createProxyMiddleware({
    target: 'https://api.tollguru.com',
    changeOrigin: true,
    pathRewrite: {
        '^/tollguru': '', // remove /tollguru from the URL
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('x-api-key', '3hrqQ4PQDfmNMrPR6Qnrgq6mGjh4DbnT');
    },
}));

app.listen(3000, () => {
    console.log('Proxy server listening on port 3000');
});

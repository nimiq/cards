const CopyWebpackPlugin = require('copy-webpack-plugin');

// Fix build for Node version with OpenSSL 3
const crypto = require('crypto');

const origCreateHash = crypto.createHash;
crypto.createHash = (alg, opts) => origCreateHash(alg === 'md4' ? 'md5' : alg, opts);

module.exports = {
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                { from: 'node_modules/qr-scanner/qr-scanner-worker.*', to: 'js', flatten: true },
            ]),
        ],
    },
    outputDir: 'deployment/dist',
    publicPath: '',
};

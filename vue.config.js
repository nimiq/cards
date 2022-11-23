// Fix build for Node version with OpenSSL 3
const crypto = require('crypto');

const origCreateHash = crypto.createHash;
crypto.createHash = (alg, opts) => origCreateHash(alg === 'md4' ? 'md5' : alg, opts);

module.exports = {
    outputDir: 'deployment/dist',
    publicPath: '',
};

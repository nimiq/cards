const CopyWebpackPlugin = require('copy-webpack-plugin');

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

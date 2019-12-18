const chainWebpack = (config) => {
    // export our svg images to dist without renaming such that we can easier preload / prefetch them
    config.module
        .rule('svg')
        .use('file-loader')
        .loader('file-loader')
        .tap(options => ({
            ...options,
            name: 'img/[name].[ext]',
        }));
};

module.exports = {
    outputDir: 'deployment/dist',
    publicPath: '',
    chainWebpack,
};

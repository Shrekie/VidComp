const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    
    chainWebpack(config, context) {

        config
        .output
        .path(path.resolve(__dirname, 'public'));

        config.module
        .noParse(/ffmpeg/)
        .rule('ffmpeg')
        .test(/\.(js|jsx)$/)
        .exclude 
        .add(/ffmpeg/)
        .add(/node_modules/)
        .end()
        .use('babel')
        .loader('babel-loader')

        config
        .plugin("CompressionPlugin")
        .use(CompressionPlugin, [{test: /\.(js|jsx)$/, deleteOriginalAssets: true}]);

        config.module
        .rule('gzip')
        .test(/\.gz$/)
        .pre()
        .use('gzip-loader')
        .loader('gzip-loader');

    }
    
}
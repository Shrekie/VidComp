const path = require('path');

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
        .add(/node_modules/)
        .add(/ffmpeg/)

    }
    
}
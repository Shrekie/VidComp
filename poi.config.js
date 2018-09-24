const path = require('path');

module.exports = {
    chainWebpack(config, context) {
        config
        .output
        .path(path.resolve(__dirname, 'public'));
    }
}
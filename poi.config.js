const path = require('path');

module.exports = {
    configureWebpack(config, context) {
        config.output.path = path.resolve(__dirname, 'server/public');
    }
}
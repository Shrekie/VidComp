const path = require('path');

//require('./node_modules/vuetify/dist/vuetify.min.css')

module.exports = {
    configureWebpack(config, context) {
        config.output.path = path.resolve(__dirname, 'server/public');
    }
}
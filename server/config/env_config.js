var env = process.env.NODE_ENV || 'development';

/*
if(env == 'development'){
    const envar = require('./envar.js');
    process.env.clientID = envar.clientID;
    process.env.clientSecret = envar.clientSecret;
    process.env.sessionSecret = envar.sessionSecret;
}
*/

process.env.PORT = 5000;

module.exports = {env};
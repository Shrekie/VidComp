/*
    Enviromental variables binding
*/

var env = process.env.NODE_ENV || 'development';


if(env == 'development'){
    const envar = require('./envar.js');
    process.env.clientID = envar.clientID;
    process.env.clientSecret = envar.clientSecret;
    process.env.sessionSecret = envar.sessionSecret;
}


if(env === 'development'){
    process.env.MONGO_URL = 'mongodb://mongodb:27017/pve-application';
    process.env.PORT = 8000;
}

module.exports = {env};
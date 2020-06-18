'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_user';

exports.ensureAuth = (req, resp, next) => {

    if(!req.headers.authorization){
        return resp.status(403).send( {message: 'La peticion no tiene la cabecera de autenticación'} );
    }
    
    var token = req.headers.authorization.replace(/['"]+/g, "");
    try {
        var payload = jwt.decode( token, secret);

        if(payload.exp <= moment().unix()){
            return resp.status(401).send( {message: 'El token expiro'} );            
        }
    } catch (error) {
        // console.log( error );
        return resp.status(404).send( {message: 'El token no es valido'} );
    }

    req.user = payload;
    next();
}
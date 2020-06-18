'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_user';

exports.createToken = (user) => {

    var payload = {
        sub: user.id,
        nombre:user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp:moment().add(30, 'days').unix
    }

    return jwt.encode(payload, secret)
}
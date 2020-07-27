'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema ({
    nombre: String,
    apellido: String,
    dni: String,
    nick: String,
    image: String,
    password: String,
    clubHincha: String,
    clubJuega: String,
    direccion: String,
    localidad: String,
    email: String,
    posicion: String,
    score: String,
    nacimiento: String,
    role: String,
    pago: Boolean
});

module.exports = mongoose.model('User', UserSchema)

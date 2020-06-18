'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClaseSchema = Schema ({
    nombre: String,
    descripcion: String,
    video: String,
    image: String,
    profesores: String,
    text: String,
    categoria: String,
    fecha: Number
});

module.exports = mongoose.model('Clase', ClaseSchema)

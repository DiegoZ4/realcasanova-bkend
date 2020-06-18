'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoticiaSchema = Schema ({
    titulo: String,
    descripcion: String,
    video: String,
    image: String,
    profesores: String,
    text: String,
    categoria: { type: Schema.ObjectId, ref: 'Categoria'},
    fecha:Number
});

module.exports = mongoose.model('Noticia', NoticiaSchema)

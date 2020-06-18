'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Rutas
var user_routes = require('./routes/user');
var clase_routes = require('./routes/clase');
var noticia_routes = require('./routes/noticia');
var categoria_routes = require('./routes/categoria');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Configurar headers

// Rutas base
app.use('/api', user_routes);
app.use('/api', clase_routes);
app.use('/api', noticia_routes);
app.use('/api', categoria_routes);


module.exports = app;
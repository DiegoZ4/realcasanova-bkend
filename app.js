'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');



var app = express();


//Rutas
var user_routes = require('./routes/user');
var clase_routes = require('./routes/clase');
var noticia_routes = require('./routes/noticia');
var categoria_routes = require('./routes/categoria');
var mp_routes = require('./routes/mp');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))



//Cors
var cors = require('cors');
app.use(cors());

//Configurar headers
app.use( (req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    // res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');


    next();
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Rutas base
app.use('/api', user_routes);
app.use('/api', clase_routes);
app.use('/api', noticia_routes);
app.use('/api', categoria_routes);

//RutasMP
app.use('/mp', mp_routes);





module.exports = app;
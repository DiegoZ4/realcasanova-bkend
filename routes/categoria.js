'use strict'

var express = require('express');
var categoriaController = require('../controllers/categoriaController');

var api = express.Router();
var md_auth = require('../middlewares/auntenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/categorias' });

api.get('/categorias/:page?', md_auth.ensureAuth, categoriaController.getCategorias);
api.get('/categoria/:id', md_auth.ensureAuth, categoriaController.getCategoria);
api.post('/categoria', categoriaController.saveCategoria);
api.put('/categoria/:id', md_auth.ensureAuth, categoriaController.updateCategoria);
api.delete('/categoria/:id', md_auth.ensureAuth, categoriaController.deleteCategoria);
api.post('/upload-image-categoria/:id', [md_auth.ensureAuth, md_upload], categoriaController.uploadImage);
api.get('/get-image-categoria/:imageFile', categoriaController.getImageFile);

module.exports = api;
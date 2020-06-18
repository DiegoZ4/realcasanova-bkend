'use strict'

var express = require('express');
var noticiaController = require('../controllers/noticiaController');

var api = express.Router();
var md_auth = require('../middlewares/auntenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/noticias' });

api.get('/noticias/:page?', md_auth.ensureAuth, noticiaController.getNoticias);
api.get('/noticia/:id', md_auth.ensureAuth, noticiaController.getNoticia);
api.post('/noticia', noticiaController.saveNoticia);
api.put('/noticia/:id', md_auth.ensureAuth, noticiaController.updateNoticia);
api.delete('/noticia/:id', md_auth.ensureAuth, noticiaController.deleteNoticia);
api.post('/upload-image-noticia/:id', [md_auth.ensureAuth, md_upload], noticiaController.uploadImage);
api.get('/get-image-noticia/:imageFile', noticiaController.getImageFile);

module.exports = api;
'use strict'

var express = require('express');
var claseController = require('../controllers/claseController');

var api = express.Router();
var md_auth = require('../middlewares/auntenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/clases' });

api.get('/clases/:page?', md_auth.ensureAuth, claseController.getClases);
api.get('/clase/:id', md_auth.ensureAuth, claseController.getClase);
api.post('/clase', claseController.saveClase);
api.put('/clase/:id', md_auth.ensureAuth, claseController.updateClase);
api.delete('/clase/:id', md_auth.ensureAuth, claseController.deleteClase);
api.post('/upload-image-clase/:id', [md_auth.ensureAuth, md_upload], claseController.uploadImage);
api.get('/get-image-clase/:imageFile', claseController.getImageFile);

module.exports = api;
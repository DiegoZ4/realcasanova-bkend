'use strict'

var express = require('express');
var claseController = require('../controllers/claseController');

var api = express.Router();
var md_auth = require('../middlewares/auntenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/clases' });

var cors = require('cors');

api.get('/clases/:page?', cors(), md_auth.ensureAuth, claseController.getClases);
api.get('/clase/:id', cors(), md_auth.ensureAuth, claseController.getClase);
api.post('/clase', cors(), claseController.saveClase);
api.put('/clase/:id', cors(), md_auth.ensureAuth, claseController.updateClase);
api.delete('/clase/:id', cors(), md_auth.ensureAuth, claseController.deleteClase);
api.post('/upload-image-clase/:id', cors(), [md_auth.ensureAuth, md_upload], claseController.uploadImage);
api.get('/get-image-clase/:imageFile', cors(), claseController.getImageFile);

module.exports = api;
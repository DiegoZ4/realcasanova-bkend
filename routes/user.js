'use strict'

var express = require('express');
var userController = require('../controllers/userController');

var api = express.Router();
var md_auth = require('../middlewares/auntenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

var cors = require('cors');

api.get('/test', cors(), md_auth.ensureAuth, userController.pruebas);
api.get('/users/:page?', cors(), md_auth.ensureAuth, userController.getUsers);
api.get('/user/:id', cors(), md_auth.ensureAuth, userController.getUser);
api.post('/register', cors(), userController.saveUser);
api.post('/login', cors(), userController.loginUser);
api.put('/update-user/:id', cors(), md_auth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', cors(), [md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get('/get-image-user/:imageFile', cors(), userController.getImageFile);

module.exports = api;
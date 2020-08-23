'use strict'

var express = require('express');
var userController = require('../controllers/userController');

var api = express.Router();
var md_auth = require('../middlewares/auntenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

var cors = require('cors');

api.get('/test',  md_auth.ensureAuth, userController.pruebas);
api.get('/users/:page?', md_auth.ensureAuth, userController.getUsers);
api.get('/user/:id', md_auth.ensureAuth, userController.getUser);
api.post('/register', userController.saveUser);
api.post('/login', cors(), userController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get('/get-image-user/:imageFile', userController.getImageFile);

module.exports = api;
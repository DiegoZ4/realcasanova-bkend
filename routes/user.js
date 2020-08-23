'use strict'

var express = require('express');
const cors = require('cors');
var userController = require('../controllers/userController');

var api = express.Router();
var md_auth = require('../middlewares/auntenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    'http://gacetamercantil.com',
    'http://www.gacetamercantil.com'
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    }
  }

api.get('/test', md_auth.ensureAuth, userController.pruebas);
api.get('/users/:page?', md_auth.ensureAuth, userController.getUsers);
api.get('/user/:id', md_auth.ensureAuth, userController.getUser);
api.post('/register', userController.saveUser);
api.post('/login', cors(corsOptions), userController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], userController.uploadImage);
api.get('/get-image-user/:imageFile', userController.getImageFile);

module.exports = api;
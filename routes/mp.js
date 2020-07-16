
'use strict'

var express = require('express');
var path = require('path');



//Controladores de MP

const PaymentController = require("../controllers/PaymentController");
//importamos el controller

const PaymentService = require("../services/PaymentService"); 
//importamos el service


var api = express.Router();
var md_auth = require('../middlewares/auntenticate');

// var multipart = require('connect-multiparty');
// var md_upload = multipart({ uploadDir: './uploads/users' });

// api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);

api.post("/payment/new", PaymentController.newPayment);

api.get('/', function(req, res) {
    // res.sendFile('/index.html');
    res.sendFile(path.join(__dirname + '/index.html'));
});

var product = require('../controllers/productController.js');

// api.get('/product', product.list);
api.get('/create', product.create);


module.exports = api;


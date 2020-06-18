'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');


function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una accion del controlador de usuario'
    })
}

function saveUser(req, res) {
    var user = new User();

    var params = req.body;

    console.log(params);

    user.nombre = params.nombre;
    user.apellido = params.apellido;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.password = params.password;
    user.image = null;
    user.nick = params.nick;

    if( params.password ) {
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            if(user.nombre != null && user.apellido && user.email != null) {
                user.save( (err, userStores) => {
                    if(err){
                        res.status(500).send( { message: 'Error al guardar el usuario' });
                    } else {
                        if(!userStores){
                            res.status(404).send( { message: 'No se registro el usuario' });
                        }else{
                            res.status(200).send( { user: userStores });
                        }
                    }
                })
            } else {
                res.status(200).send( { message: 'Introduce todos los campos' })
            }
        })
    } else {
        res.status(500).send( { message: 'Introduce una contraseña' });
    }
}

function loginUser(req, res) {

    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({
        email: email.toLowerCase()
    }, (err, user) => {
        if( err ) {
            res.status(500).send( { message: 'Error en la peticion del mail '+email });
        }else{
            if(!user){
                res.status(404).send( { message: 'No existe el usuario' });
            }else {
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check) {
                        if(params.gethash) {
                            console.log(user);
                            res.status(200).send( { token: jwt.createToken(user), user: user });
                        }else {
                            res.status(200).send( { user: user });
                        }
                    }else{
                        res.status(500).send( { message: 'La contraseña es incorrecta' });
                    }
                })
            }
        }
    })
}

function updateUser(req, res) {

    var update = req.body;
    var userId = req.params.id;

    User.findByIdAndUpdate(userId, update, (err, userUpdate)=>{
        if(err){
            res.status(500).send( { message: 'Error al actualizar el usuario' });
        }else{
            if(!userUpdate){
                res.status(404).send( { message: 'No se ha podido actualizar el usuario' });
            }else{
                res.status(200).send( { user: userUpdate });
            }
        }
    })

}

function uploadImage( req, res) {
    var userId = req.params.id;
    var file_name = 'No subido';

    if(req.files){
        var file_path = req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\/');
        console.log(file_split);
        var file_name = file_split[2];

        console.log(file_name);

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, { image: file_name}, (err, userUpdate)=>{
                if(!userUpdate){
                    res.status(404).send( { message: 'No se ha podido actualizar el usuario' });
                }else{
                    res.status(200).send( { user: userUpdate });
                }
            })
        }else{
            res.status(200).send( { message: 'Extención de archivo no valida' });
        }
        console.log(file_path);
    }else{
        res.status(200).send( { message: 'No ha subido ninguna imagen' });
    }
}

function getImageFile(req, res) {

    var imageFile = req.params.imageFile;
    
    fs.exists('./uploads/users/'+imageFile, (exists) => {

        if( exists ){
            res.sendFile(path.resolve('./uploads/users/'+imageFile))
        }else{
            res.status(200).send( { message: 'La imagen no existe' });    
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
}
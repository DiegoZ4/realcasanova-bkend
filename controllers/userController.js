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

function getUsers(req, res) {

    if(req.params.page) {
        var page = req.params.page;

        var itemsPerPage = 3;

        User.find().sort('nombre').paginate(page, itemsPerPage, (err, users, total) => {
            if(err) {
                res.status(500).send( { message: 'Error en la peticion' });   
            }else{
                if(!users) {
                    res.status(404).send( { message: 'No hay usuarios' });   
                }else{
                    return res.status(200).send( { 
                        total_items: total,
                        users: users 
                    });   
                }
            }
        })
    }else{
        User.find().sort('nombre').then(
            success => res.status(200).send( {users: success}),
            err => res.status(500).send( { message: 'Error en la peticion', error: err })
        )
    }

}

function getUser(req, res) {
    
    
    var _id = req.params.id;

    User.findOne({
        _id: _id
    }, (err, user) => {
        if( err ) {
            res.status(500).send( { message: 'Error en la peticion del usuario '+id });
        }else{
            if(!user){
                res.status(404).send( { message: 'No existe el usuario' });
            }else {
                res.status(200).send( { user: user });
            }    
        }
    })
}

function saveUser(req, res) {
    var user = new User();

    console.log(user);

    var params = req.body;
    var email = params.email;

    console.log(params);

    user.nombre = params.nombre;
    user.apellido = params.apellido;
    user.dni = params.dni;
    user.email = params.email;
    user.role = params.role;
    user.password = params.password;
    user.image = null;
    user.nick = params.nick;

    user.clubHincha = params.clubHincha;
    user.clubJuega = params.clubJuega;
    user.direccion = params.direccion;
    user.localidad = params.localidad;
    user.posicion = params.posicion;
    user.score = params.score;
    user.nacimiento = params.nacimiento;
    user.pago = params.pago;
    user.clases = params.clases;

    User.findOne({
        email: email.toLowerCase()
    }, (err, userOld) => {
        if( err ) {
            res.status(500).send( { message: 'Error en la peticion del mail '+email });
        }else{
            if(!userOld){
                
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

            }else {
                res.status(404).send( { message: 'Ya existe el usuario' });                  
            }
        }
    })


    
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
                            console.log("LOG DEL LOGIN");
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

    console.log("valosres a update");
    console.log(update);

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdate)=>{
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
            User.findByIdAndUpdate(userId, { image: file_name}, {new: true}, (err, userUpdate)=>{
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
    getImageFile,
    getUsers,
    getUser,
}
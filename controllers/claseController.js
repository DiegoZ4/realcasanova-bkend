'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var moment = require('moment');

var Clase = require('../models/clase');

function getClase(req, res){

    var claseId = req.params.id;

    Clase.findById(claseId, (err, clase) => {
        if(err){
            res.status(500).send( { message: 'Error en la peticion' }); 
        }else{
            if(!clase){
                res.status(404).send( { message: 'No existe la clase' }); 
            }else{
                res.status(200).send( { clase: clase }); 
            }
        }
    })

}

function getClases(req, res) {

    if(req.params.page) {
        var page = req.params.page;

        var itemsPerPage = 3;

        Clase.find().sort('nombre').paginate(page, itemsPerPage, (err, clases, total) => {
            if(err) {
                res.status(500).send( { message: 'Error en la peticion' });   
            }else{
                if(!clases) {
                    res.status(404).send( { message: 'No hay clases' });
                }else{
                    return res.status(200).send( { 
                        total_items: total,
                        clases: clases 
                    });   
                }
            }
        })
    }else{
        
        Clase.find().sort('nombre').then(
            success => res.status(200).send( {clases: success}),
            err => res.status(500).send( { message: 'Error en la peticion', error: err })
        )
    }
    
    

}

function saveClase(req, res){

    var clase = new Clase();
    var params = req.body;

    clase.nombre = params.nombre;
    clase.descripcion = params.descripcion;
    clase.video = params.video;
    clase.profesores = params.profesores;
    clase.text = params.text;
    clase.image = null;
    clase.categoria = params.categoria;
    clase.fecha = moment().unix();

    clase.save( ( err, claseStored) => {
        if(err){
            res.status(500).send( { message: 'Error al guardar la clase' });        
        }else{
            if(!claseStored){
                res.status(404).send( { message: 'La clase no fue guardada' }); 
            }else{
                res.status(200).send( { clase: claseStored }); 
            }
        }
    })
}

function updateClase(req, res) {

    var claseId = req.params.id;
    var update = req.body;

    Clase.findByIdAndUpdate(claseId, update, {new: true}, (err, claseUpdated) => {
        if(err){
            res.status(500).send( { message: 'Error al actualizar la clase' });        
        }else{
            if(!claseUpdated){
                res.status(404).send( { message: 'La clase no fue actualizada' }); 
            }else{
                res.status(200).send( { clase: claseUpdated }); 
            }
        }
    })
}

function deleteClase(req, res) {
    var claseId = req.params.id;

    Clase.findByIdAndDelete(claseId, (err, claseDeleted) => {
        if(err){
            res.status(500).send( { message: 'Error al eliminar la clase' });        
        }else{
            if(!claseDeleted){
                res.status(404).send( { message: 'La clase no fue eliminada' }); 
            }else{
                res.status(200).send( { claseDeleted: claseDeleted }); 
            }
        }
    })
}

function uploadImage( req, res) {
    var claseId = req.params.id;
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
            Clase.findByIdAndUpdate(claseId, { image: file_name}, {new: true}, (err, claseUpdate)=>{
                if(!claseUpdate){
                    res.status(404).send( { message: 'No se ha podido actualizar la clase' });
                }else{
                    res.status(200).send( { clase: claseUpdate });
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
    
    fs.exists('./uploads/clases/'+imageFile, (exists) => {

        if( exists ){
            res.sendFile(path.resolve('./uploads/clases/'+imageFile))
        }else{
            res.status(200).send( { message: 'La imagen no existe' });    
        }
    })
}

module.exports = {
    getClase,
    saveClase,
    getClases,
    updateClase,
    deleteClase,
    uploadImage,
    getImageFile
}
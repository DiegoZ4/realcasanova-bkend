'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var moment = require('moment');

var Noticia = require('../models/noticia');

function getNoticia(req, res){

    var noticiaId = req.params.id;

    Noticias.findById(noticiaId, (err, noticia) => {
        if(err){
            res.status(500).send( { message: 'Error en la peticion' }); 
        }else{
            if(!noticia){
                res.status(404).send( { message: 'No existe la noticia' }); 
            }else{
                res.status(200).send( { noticia: noticia }); 
            }
        }
    })

}

function getNoticias(req, res) {

    if(req.params.page) {
        var page = req.params.page;
    }else{
        var page = 1;
    }
    
    var itemsPerPage = 3;

    Noticia.find().sort('nombre').paginate(page, itemsPerPage, (err, noticias, total) => {
        if(err) {
            res.status(500).send( { message: 'Error en la peticion' });   
        }else{
            if(!noticias) {
                res.status(404).send( { message: 'No hay noticias' });   
            }else{
                return res.status(200).send( { 
                    total_items: total,
                    noticias: noticias 
                });   
            }
        }
    })

}

function saveNoticia(req, res){

    var noticia = new Noticia();
    var params = req.body;

    noticia.nombre = params.nombre;
    noticia.descripcion = params.descripcion;
    noticia.video = params.video;
    noticia.profesores = params.profesores;
    noticia.text = params.text;
    noticia.image = null;
    noticia.categoria = params.categoria;
    noticia.fecha = moment().unix();

    noticia.save( ( err, noticiaStored) => {
        if(err){
            res.status(500).send( { message: 'Error al guardar la noticia' });        
        }else{
            if(!noticiaStored){
                res.status(404).send( { message: 'La noticia no fue guardada' }); 
            }else{
                res.status(200).send( { noticia: noticiaStored }); 
            }
        }
    })
}

function updateNoticia(req, res) {

    var noticiaId = req.params.id;
    var update = req.body;

    Noticia.findByIdAndUpdate(noticiaId, update, (err, noticiaUpdated) => {
        if(err){
            res.status(500).send( { message: 'Error al actualizar la noticia' });        
        }else{
            if(!noticiaUpdated){
                res.status(404).send( { message: 'La noticia no fue actualizada' }); 
            }else{
                res.status(200).send( { noticia: noticiaUpdated }); 
            }
        }
    })
}

function deleteNoticia(req, res) {
    var noticiaId = req.params.id;

    Noticia.findByIdAndDelete(noticiaId, (err, noticiaDeleted) => {
        if(err){
            res.status(500).send( { message: 'Error al eliminar la noticia' });        
        }else{
            if(!noticiaDeleted){
                res.status(404).send( { message: 'La noticia no fue eliminada' }); 
            }else{
                res.status(200).send( { noticiaDeleted: noticiaDeleted }); 
            }
        }
    })
}

function uploadImage( req, res) {
    var noticiaId = req.params.id;
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
            Noticia.findByIdAndUpdate(noticiaId, { image: file_name}, (err, noticiaUpdate)=>{
                if(!noticiaUpdate){
                    res.status(404).send( { message: 'No se ha podido actualizar la noticia' });
                }else{
                    res.status(200).send( { noticia: noticiaUpdate });
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
    
    fs.exists('./uploads/noticias/'+imageFile, (exists) => {

        if( exists ){
            res.sendFile(path.resolve('./uploads/noticias/'+imageFile))
        }else{
            res.status(200).send( { message: 'La imagen no existe' });    
        }
    })
}

module.exports = {
    getNoticia,
    saveNoticia,
    getNoticias,
    updateNoticia,
    deleteNoticia,
    uploadImage,
    getImageFile
}
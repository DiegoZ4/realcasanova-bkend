'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var moment = require('moment');

var Categoria = require('../models/categoria');

function getCategoria(req, res){

    var categoriaId = req.params.id;

    Categoria.findById(categoriaId, (err, categoria) => {
        if(err){
            res.status(500).send( { message: 'Error en la peticion' }); 
        }else{
            if(!categoria){
                res.status(404).send( { message: 'No existe la categoria' }); 
            }else{
                res.status(200).send( { categoria: categoria }); 
            }
        }
    })

}

function getCategorias(req, res) {

    if(req.params.page) {
        var page = req.params.page;
    }else{
        var page = 1;
    }
    
    var itemsPerPage = 3;

    Categoria.find().sort('nombre').paginate(page, itemsPerPage, (err, categorias, total) => {
        if(err) {
            res.status(500).send( { message: 'Error en la peticion' });   
        }else{
            if(!categorias) {
                res.status(404).send( { message: 'No hay categorias' });   
            }else{
                return res.status(200).send( { 
                    total_items: total,
                    categorias: categorias 
                });   
            }
        }
    })

}

function saveCategoria(req, res){

    var categoria = new Categoria();
    var params = req.body;

    categoria.nombre = params.nombre;

    categoria.save( ( err, categoriaStored) => {
        if(err){
            res.status(500).send( { message: 'Error al guardar la categoria' });        
        }else{
            if(!categoriaStored){
                res.status(404).send( { message: 'La categoria no fue guardada' }); 
            }else{
                res.status(200).send( { categoria: categoriaStored }); 
            }
        }
    })
}

function updateCategoria(req, res) {

    var categoriaId = req.params.id;
    var update = req.body;

    Categoria.findByIdAndUpdate(categoriaId, update, (err, categoriaUpdated) => {
        if(err){
            res.status(500).send( { message: 'Error al actualizar la categoria' });        
        }else{
            if(!categoriaUpdated){
                res.status(404).send( { message: 'La categoria no fue actualizada' }); 
            }else{
                res.status(200).send( { categoria: categoriaUpdated }); 
            }
        }
    })
}

function deleteCategoria(req, res) {
    var categoriaId = req.params.id;

    Categoria.findByIdAndDelete(categoriaId, (err, categoriaDeleted) => {
        if(err){
            res.status(500).send( { message: 'Error al eliminar la categoria' });        
        }else{
            if(!categoriaDeleted){
                res.status(404).send( { message: 'La categoria no fue eliminada' }); 
            }else{
                res.status(200).send( { categoriaDeleted: categoriaDeleted }); 
            }
        }
    })
}

function uploadImage( req, res) {
    var categoriaId = req.params.id;
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
            Categoria.findByIdAndUpdate(categoriaId, { image: file_name}, (err, categoriaUpdate)=>{
                if(!categoriaUpdate){
                    res.status(404).send( { message: 'No se ha podido actualizar la categoria' });
                }else{
                    res.status(200).send( { categoria: categoriaUpdate });
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
    
    fs.exists('./uploads/categorias/'+imageFile, (exists) => {

        if( exists ){
            res.sendFile(path.resolve('./uploads/categorias/'+imageFile))
        }else{
            res.status(200).send( { message: 'La imagen no existe' });    
        }
    })
}

module.exports = {
    getCategoria,
    saveCategoria,
    getCategorias,
    updateCategoria,
    deleteCategoria,
    uploadImage,
    getImageFile
}
'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;


mongoose.connect(
    'mongodb://localhost:27017/realcasanova', 
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, res) => {
        if( err ){
            throw err;
        } else {
            console.log( "Conexión a db Ok");

            app.listen(port, () => {
                console.log( "Batiserver Ready on http://localhost:"+ port );
            })
        }
});
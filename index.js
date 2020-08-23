'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

const https = require("https"),
fs = require("fs");

const httpsOptions = {
  key: fs.readFileSync("/sites/dzaragoza/realcasanova-bkend/certs/rapidssl_gacetamercantil_2018.key"),
  cert: fs.readFileSync("/sites/dzaragoza/realcasanova-bkend/certs/rapidssl_gacetamercantil_2018.crt")
};

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

            https.createServer(httpsOptions, app).listen(port+1);
        }
});
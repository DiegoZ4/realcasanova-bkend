var productController = {};

var mp = require('mercadopago');

mp.configure({
    sandbox: true,
    access_token: "TEST-2661898378398643-071102-21fe6d167c4c785d7397b8195d8f8d55-90637203"
});

// Crea un objeto de preferencia
var preference = {
    items: [
      {
        title: 'Test',
        quantity: 1,
        currency_id: 'ARS',
        unit_price: 10.5
      }
    ]
  };

productController.list = function(req, res){
    
    res.render('../views/product/index' );
    
};

productController.create = function(req, res){

    mp.preferences.create(preference)
        .then(function(response){
            // Este valor reemplazará el string "$$init_point$$" en tu HTML
            global.init_point = response.body.init_point;
            console.log(global.init_point);
        }).catch(function(error){
            console.log(error);
        });

    res.render('../views/product/create');
};

module.exports = productController;
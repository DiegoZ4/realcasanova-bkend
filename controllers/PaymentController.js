'use strict'

var mp = require('mercadopago');

// mp.configure({
//     sandbox: true,
//     access_token: "TEST-2661898378398643-071102-21fe6d167c4c785d7397b8195d8f8d55-90637203"
// });

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

  

var payment = {
    description: 'Buying a PS4',
    transaction_amount: 10500,
    payment_method_id: 'rapipago',
    payer: {
      email: 'viene_el_gol@hotmail.com',
      identification: {
        type: 'DNI',
        number: '34123123'
      }
    }
  };

  

function newPayment() {

    

    mp.preferences.create(preference)
        .then(function(response){
            // Este valor reemplazará el string "$$init_point$$" en tu HTML
            global.init_point = response.body.init_point;
            console.log(global.init_point);
        }).catch(function(error){
            console.log(error);
        });


    // mp.payment.create(payment).then(function (data) {
    //     console.log( data );
    //   }).catch(function (error) {
    //     console.log( error );
    //   });

}

  
  
module.exports = {
    newPayment
}
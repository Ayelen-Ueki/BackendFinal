const mongoose = require('mongoose');

//Definir el schema para el carrito
const CartSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    products: [{
        //Referenciar al Product model
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' 
        }
    }]
});

//Automatizacion de la funcion populate
CartSchema.pre('find', function(next) {
    this.populate('products.product');
    next();
});

// Definimos Cart model
const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
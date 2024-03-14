const { modelNames } = require("mongoose");
const mongoose = required('mongoose');
const mongoPaginate = require('mongoose-paginate-v2')

const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true,
        index: true
    },
    price:{
        type:Number,
        require: true
    },
    category:{
        type: String,
        require: true,
        enum:[Tortas, Galles, Alfajores, Combos, Otros],
        index: true
    },
    stock:{
        type: Number, 
        default: 20
    }
})

ProductSchema.plugin(mongoPaginate)

//El primer argumento es el nombre de la colaccion en Mongo
const Product = mongoose.model('products', ProductSchema)
module.exports=Product
const { modelNames } = require("mongoose");
const mongoose = required('mongoose');

const usuariosSchema = mongoose.model('usuarios', new mongoose.Schema({
    email:{
        type: String,
        unique:true,
        required: true
    },
    name:{
        type: String,
        required: true,
    },
    lastname:{
        type:String,
        required: true,
        index: true
    },
    password:{
        type: String,
        required: true,
    },
    tel:{
        type: Number, 
        required: true,
    }
},
{
    timestamps:true,
    strict:false
})
)

//El primer argumento es el nombre de la colaccion en Mongo
const usuariosModelo = mongoose.model('usuario', usuariosSchema)
module.exports=usuariosModelo
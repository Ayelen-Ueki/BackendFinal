const { modelNames } = require("mongoose");
const mongoose = required('mongoose');

    const usuariosSchema = mongoose.model('usuarios', new mongoose.Schema({
        email:{
            type: String,
            unique:true,
            required: true
        },
        first_name:{
            type: String,
            required: true,
        },
        last_name:{
            type:String,
            required: true,
            index: true
        },
        age:{
            type: Number,
        },
        password:{
            type: String,
            required: true,
        },
        cart: [{
            //Referenciar al Product model
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Cart' 
            }
        }],
        role:{
            type:String,
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
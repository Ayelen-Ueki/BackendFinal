// Conectar Mongoose
const mongoose = require('mongoose');
const Cart = require('./models/cart.models')
const Product = require('./models/products.models')

module.exports={
    connect:()=>{
        return mongoose.connect("mongodb+srv://ayeueki:proyectoBackend1@cluster0.bkssllr.mongodb.net/")
        .then(async()=>{
            console.log("Base de datos conectada")
            //creamos un carrito
            Cart.create(data) 
            Product.create({
                name:'Torta de chocolate', 
                price:7000, 
                category:'Tortas', 
                stock: 5
            })
            //Completar con el id de algun producto creado. Populate desglosa un objeto para que se vea mejor
            let cart1 = await Cart.find({_id:''})//.populate('products.product')
            //'product' es lo que yo habia establecido que iba a ir dentro de cart en el modelo de cart.js
            //Pusheo el producto con su id
            cart1.products.push({product:''})
            //puedo actualizar carritos a partir del id deaseado
            await Cart.updateOne({_id:''}, cart1)

            let order = await Product.aggregate([
                {//el valor de match es el filtro que quiero utilizar para matchear mis productos
                    $match:{category:'Tortas'}
                },
                {//Con otro objeto podemos por ejemplo agrupar la data por nombre, y hacer que se sume la cantidad de cada uno de los elementos agrupados
                    $group:{_id:'$name', totalQty: {$sum: '$quantity'}}
                },
                {//1 es en order ascendente y -1 es en orden descendente
                    $sort:{totalAty:-1}
                },
                {//para pushear la informacion
                    $group:{_id:1, orders:{$push: '$$PORT'}}
                },
                {//para crear un proyecto en un formato valido. Porque para agrupar si o si necesitamos crear un nuevo Id, project elimina ese Id que no necesitamos
                    $project:{_id:0, orders:'$orders'}
                },
                {//con merge creamos una nueva coleccion en este caso de nombre "reports", aca vamos a guardar nuestro proyecto final que pusheamos en el paso anterior
                    $merge:{'into':reports}
                }

            ])
            //usamos Paginate para limitar la cantidad de datos que se muestran a la vez. limit: cuantos limites voy a tener por pagina. tambien puedo usar el otro objeto dentro de paginate para poner un filtro
            let res = Product.paginate({category:'Tortas'},{limit:10})

        }).catch(()=>{
            console.log(err)
        })
    }
}
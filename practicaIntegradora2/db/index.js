// Conectar Mongoose
const mongoose = require('mongoose');
const Cart = require('./models/cart.models');
const Product = require('./models/products.models');

module.exports = {
    connect: async () => {
        try {
            // Conectar a MongoDB Atlas
            await mongoose.connect("mongodb+srv://ayeueki:proyectoBackend1@cluster0.bkssllr.mongodb.net/");
            console.log("Database conectada exitosamente");

            // Crear un carrito
            const cartData = { data: "Data" };
            await Cart.create(cartData);

            // Ejemplo de producto
            const productData = {
                name: 'Torta de chocolate',
                price: 7000,
                category: 'Tortas',
                stock: 5
            };
            const newProduct = await Product.create(productData);

            // Encontrar carrito por id y agregar producto
            const cartId = '5fc2a79e902fe04b6c877e28'; // ID existente
            const productId = newProduct._id; // ID del nuevo producto
            let cart = await Cart.findById(cartId);
            cart.products.push({ product: productId });
            await cart.save();

            // Aggregation de productos por id
            const order = await Product.aggregate([
                { $match: { category: 'Cakes' } },
                { $group: { _id: '$name', totalQty: { $sum: '$quantity' } } },
                { $sort: { totalQty: -1 } },
                { $group: { _id: 1, orders: { $push: '$$ROOT' } } },
                { $project: { _id: 0, orders: 1 } },
                { $merge: { into: 'reports' } }
            ]);

            // Usar Paginate para limitar la cantidad de rdos por pagina
            const options = { page: 1, limit: 10 }; // Limite de 10 prods
            const query = { category: 'Cakes' }; // Filtro por categoria
            const result = await Product.paginate(query, options);
            console.log(result);
        } catch (error) {
            console.error("Error connecting to the database:", error);
        }
    }
};
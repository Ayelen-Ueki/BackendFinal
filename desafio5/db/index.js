// Conectar Mongoose
const mongoose = require('mongoose');
const Cart = require('./models/cart.models');
const Product = require('./models/products.models');

module.exports = {
    connect: async () => {
        try {
            // Conectar con MongoDB Atlas
            await mongoose.connect("mongodb+srv://ayeueki:proyectoBackend1@cluster0.bkssllr.mongodb.net/");
            console.log("Base de datos conectada");

            // Crear un carrito
            const data = { data: "Datos de ejemplo" };
            await Cart.create(data);

            // Crear un producto de ejemplo
            await Product.create({
                name: 'Torta de chocolate',
                price: 7000,
                category: 'Tortas',
                stock: 5
            });

            // Encontrar un carrito por su ID y agregar un producto
            const cartId = '5fc2a79e902fe04b6c877e28'; // ID del carrito existente
            const productId = '5fc2a83e902fe04b6c877e29'; // ID del producto creado
            let cart = await Cart.findById(cartId);
            cart.products.push({ product: productId });
            await cart.save();

            // Agregar una orden agregada de productos a un nuevo informe
            const order = await Product.aggregate([
                { $match: { category: 'Tortas' } },
                { $group: { _id: '$name', totalQty: { $sum: '$quantity' } } },
                { $sort: { totalQty: -1 } },
                { $group: { _id: 1, orders: { $push: '$$ROOT' } } },
                { $project: { _id: 0, orders: 1 } },
                { $merge: { into: 'reports' } }
            ]);

            // Usar Paginate para limitar y paginar los resultados de la consulta
            const options = { page: 1, limit: 10 }; // Limitar a 10 productos por página
            const query = { category: 'Tortas' }; // Filtro por categoría
            const result = await Product.paginate(query, options);
            console.log(result);
        } catch (error) {
            console.error("Error al conectar con la base de datos:", error);
        }
    }
};

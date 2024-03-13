import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';

const express = require('express')
const{Router}=express

const routerCart = new Router();

routerCart.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;

        // Validar que los campos obligatorios estén presentes
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: "Todos los campos obligatorios deben estar presentes" });
        }

        const id = uuidv4(); // Generar un nuevo ID aleatorio
        const status = true; // Establecer status como true

        // Crear el objeto del nuevo producto
        const newProduct = {
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail: req.body.thumbnail || [], // Usar el proporcionado o un array vacío si no se proporciona
        };

        // Agregar el nuevo producto
        const confirmation = await productManager.addProduct(newProduct);

        if (confirmation) {
            res.status(201).json({ message: "Producto creado exitosamente", data: newProduct });
        } else {
            res.status(400).json({ error: "Producto ya existente" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

routerCart.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        // Obtener el carrito por ID
        const cart = await cartManager.getCartById(cid);

        if (cart) {
            res.status(200).json({ products: cart.products });
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error al obtener los productos en el carrito" });
    }
});

routerCart.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Obtener el carrito por ID
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Verificar si el producto ya existe en el carrito
        const existingProduct = cart.products.find(product => product.product.id === pid);

        if (existingProduct) {
            // Si el producto ya existe, incrementar la cantidad
            existingProduct.quantity += 1;
        } else {
            // Si el producto no existe, agregarlo al carrito con cantidad 1
            cart.products.push({ product: { id: pid }, quantity: 1 });
        }

        // Guardar los cambios en el carrito
        await cartManager.updateCart(cid, { products: cart.products });

        res.status(201).json({ message: "Producto agregado al carrito correctamente", data: cart });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});

export default routerCart;
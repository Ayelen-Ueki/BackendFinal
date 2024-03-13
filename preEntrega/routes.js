import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';

const routerProd = Router();

// Obtener la ruta de todos los productos con límite opcional
routerProd.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const prods = await productManager.getProducts();
        const products = prods.slice(0, limit);
        res.status(200).json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error al obtener la lista de productos" });
    }
});

// Obtener la ruta de un producto por ID
routerProd.get('/:pid', async (req, res) => {
    try {
        const { id } = req.params;
        const prod = await productManager.getProductById(id);

        if (prod) {
            res.status(200).json(prod);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error al obtener el producto por ID" });
    }
});

// Agregar un nuevo producto con campos obligatorios
routerProd.post('/', async (req, res) => {
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

// Actualizar un producto por ID
routerProd.put('/:pid', async (req, res) => {
    try {
        const { id } = req.params;
        const confirmation = await productManager.updateProduct(id, req.body);

        if (confirmation) {
            res.status(201).json({ message: "Producto actualizado correctamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error al actualizar el producto por ID" });
    }
});

// Eliminar un producto por ID
routerProd.delete('/:pid', async (req, res) => {
    try {
        const { id } = req.params;
        const confirmation = await productManager.deleteProduct(id);

        if (confirmation) {
            res.status(201).json({ message: "Producto eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error al eliminar el producto por ID" });
    }
});

export default routerProd;

// PARA EL CARRITO


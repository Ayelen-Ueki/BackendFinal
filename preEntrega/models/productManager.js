import { promises as fs } from 'fs';
import crypto from 'crypto';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        return prods;
    }

    async getProductById(id) {
        const prods = await this.getProducts();
        const prod = prods.find(producto => producto.id === id);
        return prod;
    }

    async addProduct(newProduct) {
        const prods = await this.getProducts();
        const existProd = prods.find(producto => producto.id === newProduct.id);

        if (existProd) {
            return false; // Product with the same ID already exists
        }

        newProduct.id = crypto.randomBytes(16).toString('hex');
        prods.push(newProduct);

        await fs.writeFile(this.path, JSON.stringify(prods, null, 2));
        return true; // Product added successfully
    }

    async updateProduct(id, updatedProductData) {
        const prods = await this.getProducts();
        const index = prods.findIndex(producto => producto.id === id);

        if (index !== -1) {
            prods[index] = { ...prods[index], ...updatedProductData };
            await fs.writeFile(this.path, JSON.stringify(prods, null, 2));
            return true; // Product updated successfully
        } else {
            return false; // Product not found
        }
    }

    async deleteProduct(id) {
        const prods = await this.getProducts();
        const filteredProds = prods.filter(producto => producto.id !== id);

        if (filteredProds.length < prods.length) {
            await fs.writeFile(this.path, JSON.stringify(filteredProds, null, 2));
            return true; // Product deleted successfully
        } else {
            return false; // Product not found
        }
    }
}

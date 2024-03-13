import { promises as fs } from 'fs';
import crypto from 'crypto';

export class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        return carts;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(cartItem => cartItem.id === id);
        return cart;
    }

    async addCart(newCart) {
        const carts = await this.getCarts();
        const existingCart = carts.find(cartItem => cartItem.id === newCart.id);

        if (existingCart) {
            return false; // Cart with the same ID already exists
        }

        carts.push(newCart);

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return true; // Cart added successfully
    }

    async updateCart(id, updatedCartData) {
        const carts = await this.getCarts();
        const index = carts.findIndex(cartItem => cartItem.id === id);

        if (index !== -1) {
            carts[index] = { ...carts[index], ...updatedCartData };
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return true; // Cart updated successfully
        } else {
            return false; // Cart not found
        }
    }

    async deleteCart(id) {
        const carts = await this.getCarts();
        const filteredCarts = carts.filter(cartItem => cartItem.id !== id);

        if (filteredCarts.length < carts.length) {
            await fs.writeFile(this.path, JSON.stringify(filteredCarts, null, 2));
            return true; // Cart deleted successfully
        } else {
            return false; // Cart not found
        }
    }
}

export default CartManager;

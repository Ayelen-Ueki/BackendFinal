const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  static contadorIds = 0;

  constructor() {
    this.products = [];
    this.filePath = path.join(__dirname, 'productos.json');
  }

  async allProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al leer productos: ${error.message}`);
      throw error;
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    this.validateProductData(title, description, price, thumbnail, code, stock);

    const id = ProductManager.contadorIds++;

    if (!this.isProductExists(id)) {
      const newProduct = { id, title, description, price, thumbnail, code, stock };
      this.products.push(newProduct);
      this.saveProductsToFile();
      return newProduct;
    } else {
      throw new Error(`Ya existe un producto con el identificador ${id}.`);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.allProducts();
      const product = products.find((p) => p.id === id);
      if (product) {
        return product;
      } else {
        throw new Error(`Producto con el identificador ${id} no encontrado.`);
      }
    } catch (error) {
      console.error(`Error al obtener producto por ID: ${error.message}`);
      throw error;
    }
  }

  async updateProductById(id, updatedData) {
    try {
      const products = await this.allProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        await this.saveProductsToFile(products);
        return products[index];
      } else {
        throw new Error(`Producto con el identificador ${id} no encontrado.`);
      }
    } catch (error) {
      console.error(`Error al actualizar producto por ID: ${error.message}`);
      throw error;
    }
  }

  async deleteProductById(id) {
    try {
      const products = await this.allProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index !== -1) {
        const deletedProduct = products.splice(index, 1)[0];
        await this.saveProductsToFile(products);
        return deletedProduct;
      } else {
        throw new Error(`Producto con el identificador ${id} no encontrado.`);
      }
    } catch (error) {
      console.error(`Error al eliminar producto por ID: ${error.message}`);
      throw error;
    }
  }

  async saveProductsToFile(products) {
    try {
      const data = JSON.stringify(products || this.products, null, 2);
      await fs.writeFile(this.filePath, data);
      console.log(`Productos guardados en ${this.filePath}`);
    } catch (error) {
      console.error(`Error al guardar productos en archivo: ${error.message}`);
      throw error;
    }
  }

  validateProductData(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos los campos son obligatorios.");
    }
  }

  isProductExists(id) {
    return this.products.some((p) => p.id === id);
  }
}

const product = new ProductManager();

(async () => {
  try {
    const product1 = await product.addProduct("Taza", "Taza de gatito", 5000, "Fotos/Taza_de_Gatito.jpeg", 1, 10);
    console.log(await product.getProductById(product1.id));

    const updatedData = { price: 6000, stock: 12 };
    console.log(await product.updateProductById(product1.id, updatedData));

    console.log(await product.deleteProductById(product1.id));
  } catch (error) {
    console.error(error.message);
  }

  try {
    const allProducts = await product.allProducts();
    console.log("Todos los productos:", allProducts);
  } catch (error) {
    console.error(error.message);
  }
})();

module.exports = ProductManager
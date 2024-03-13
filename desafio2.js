const fs = require('fs');
const path = require('path');

class ProductManager {
  static contadorIds = 0;

  constructor() {
    this.products = [];
    this.filePath = path.join(__dirname, 'productos.json');
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

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      throw new Error(`Producto con el identificador ${id} no encontrado.`);
    }
  }

  updateProductById(id, updatedData) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedData };
      this.saveProductsToFile();
      return this.products[index];
    } else {
      throw new Error(`Producto con el identificador ${id} no encontrado.`);
    }
  }

  deleteProductById(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];
      this.saveProductsToFile();
      return deletedProduct;
    } else {
      throw new Error(`Producto con el identificador ${id} no encontrado.`);
    }
  }

  saveProductsToFile() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    console.log(`Productos guardados en ${this.filePath}`);
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

try {
  const product1 = product.addProduct("Taza", "Taza de gatito", 5000, "Fotos/Taza_de_Gatito.jpeg", 1, 10);
  console.log(product.getProductById(0)); // Muestra el producto recién agregado

  const updatedData = { price: 6000, stock: 12 };
  const updatedProduct = product.updateProductById(0, updatedData);
  console.log(updatedProduct); // Muestra el producto actualizado

  const deletedProduct = product.deleteProductById(0);
  console.log(deletedProduct); // Muestra el producto eliminado
} catch (error) {
  console.error(error.message);
}

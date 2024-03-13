// Desafío 3
const express = require('express');
const uuid4 = require('uuid4');
const bodyParser = require('body-parser');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

const products = new ProductManager();

app.get('/', (req, res) => {
  res.send('Bienvenido a mi eCommerce');
});

app.get('/allProducts', async (req, res) => {
  try {
    let response = await products.allProducts();

    const limit = req.query.limit;
    if (limit) {
      response = response.slice(0, parseInt(limit, 10));
    }

    res.send(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: 'Error al obtener productos',
      error: error.message,
    });
  }
});

app.get('/product/:id', (req, res) => {
  const prodId = req.params.id;
  const prodFound = products.getProductById(prodId);

  if (!prodFound) {
    res.status(404).send({
      message: 'Producto no encontrado',
    });
    return;
  }

  res.send({
    message: 'Producto encontrado',
    data: prodFound,
  });
});

app.post('/saveProduct', (req, res) => {
  try {
    const id = uuid4();
    let product = req.body;
    product.id = id;
    products.addProduct(
      product.title,
      product.description,
      product.price,
      product.thumbnail,
      product.code,
      product.stock
    );

    res.send({
      message: 'Producto guardado correctamente',
      data: product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).send({
      message: 'Error al guardar el producto',
      error: error.message,
    });
  }
});

app.delete('/deleteProduct/:id', (req, res) => {
  const prodId = req.params.id;
  try {
    const deletedProduct = products.deleteProductById(prodId);

    res.send({
      message: 'Producto eliminado',
      data: deletedProduct,
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).send({
      message: 'Producto no encontrado',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log('Server con express', PORT);
});
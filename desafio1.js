class ProductManager{
    //Conteo de Ids
    static contadorIds = 0;
    //Tienda
    constructor(){
        this.products=[];
    }
    //Para agregar productos en la tienda
    addProduct(title, description, price, thumbnail, code, stock, id){
        //Valida que no falte ningún dato a la hora de agregar un producto
        if(!title|| !description|| !price|| !thumbnail|| !code|| !stock){
            throw new Error("Todos los campos son obligatorios.");
        }
        //Para incrementar el número de id al agregar un producto
        const id = ProductManager.contadorIds++;
        //Agrega productos no repetidos con el metodo some
        if(!this.products.some((p)=>p.id===id)){
            let newProduct = { id, title, description, price, thumbnail, code, stock };
            this.products.push(newProduct);
            return newProduct;
        } else{
            throw new Error(`Ya existe un producto con el identificador ${id}.`);
        }
        }

    }
    //Para buscar productos en la tienda por Id
    getProductById(id);{
        let product =  this.products.find((p) => p.id === id)
        if (product){
            return product;
        } else {
            throw new Error(`Id: ${id} not found`);
        }
    }

const product = new ProductManager();

//Agregar productos
try {
    const product1 = product.addProduct("Taza", "Taza de gatito", 5000, "C:\Users\aye_u\OneDrive\Documentos\Backend\Fotos\Taza de Gatito.jpeg", 1, 10)
} catch (error){
    console.error(error.message);
}
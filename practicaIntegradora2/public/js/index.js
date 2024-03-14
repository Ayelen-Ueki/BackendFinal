// Del lado del cliente para escuchar al servidor
const socket = io()
//El primer parametro de on que es lo que me permite escuchar eventos es el evento que sale del lado del server y que yo quiero que se escuche del lado del cliente en este
socket.on('message', (data)=>{
    console.log(data)
    //Usamos la funcion que nos envia los mensajes al html
    render(data)
    //Para agregar un scroll para mostrar mensajes cuando se vuelva muy largo el array y que la barra se mantenga siempre abajo: que mueste siempre el ultimo mensaje
    let chat = document.getElementById('lista')
    chat.scrollTop = chat.scrollHeight
})

const render = (data) =>{
    data.map(elem => {
        return (`
        <div>
            <strong>
                {elem.name} agrego {elem.product}
            </strong>
            <button onclick="deleteProduct('${elem.productId}')">Delete</button>
        </div>
        `)
    //Usamos el .join para que los mensajes se muestren unidos por un espacio en lugar de una coma    
    }).join(' ')
    //Para meter ese codigo dentro de mi html en home.handlebars
    document.getElementById('lista').innerHTML = html
}


//Para mandar mensajes usando el formulario de home.handlebars al servidor
// const addMessage = () =>{
//     const msg ={
//         author: document.getElementbyId('name').value, 
//         text: document.getElementById('message').value
//     }
//     //envio el mensaje por socket al servidor
//     socket.emit('new-messages', msg)
//     //para eliminar el comportamiento por defecto que tiene el formulario del que estoy tomando la informacion de recargarse luego de enviar la informacion
//     return false
// }

const addProduct = () =>{
    const prd ={
        author: document.getElementbyId('name').value, 
        product: document.getElementById('product').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value
    }
    //envio el mensaje por socket al servidor
    socket.emit('new-messages', prd)
    //para eliminar el comportamiento por defecto que tiene el formulario del que estoy tomando la informacion de recargarse luego de enviar la informacion
    return false
}

const deleteProduct = (productId) => {
    // You can use socket.emit to send the product ID to the server for deletion
    socket.emit('delete-product', productId);
};

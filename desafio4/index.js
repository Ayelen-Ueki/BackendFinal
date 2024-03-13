import { Express } from "express";
import routerProd from './routes.js';
import path from 'path'
import {__dirname} from './paths.js ';


//Activo y pongo en funcionamiento express
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
//Guardamos el puerto en el que vamos a trabajar en una constante, ya sea el 8080 que es nuestro server local o cualquiera que se le asigen a la app para trabajar (esto se hace con process)
const PORT = 8080 || process.env.PORT    

// Para que express reconozca handlebars
const handlebars = require('express-handlebars')

//Array para guardar mis mensajes
let arrProd = []

//Para utilizar cookie parser. el argumento que recibe el Cookie Parser es el key para poder encriptar la cookie
app.use(cookieParser('coderSecret'))
//para crear la cookie
app.get('/setCookie', (req,res)=>{
    //la cookie a este punto va a mostrar mi info. en el navegador una vez creada. Con Max age se confirgura el tiempo maximo de vida de la cookie, una vez finalizado se elimina (5000: son milisegundos). En el objeto de configuracion puedo habilitar la firma que me va a permitir setear el 'secreto' de la cookie para que solo pueda pueda acceder a ella
    res.cookie('CoderCookie',{user:'ayeueki@gmail.com'},{maxAge:5000,signed:true}).send('Cookie creada')
})
//Para acceder a la cookie
app.get('/getCookie', (req,res)=>{
    res.send(req.cookies)
})
//para acceder a cookies firmadas
app.get('/getCookie', (req,res)=>{
    res.send(req.signedCookies)
})
//Para borrar la cookiea partir de su nombre
app.get('/deleteCookie', (req,res)=>{
    res.clearCookie('CoderCookie').send('Cookie borrada')
})

//iniciando sesision-express para trabajar con sesiones
app.use(session({
    secret:'coderSecret',
    resave:true,
    saveUninitialized: true 
}))

app.get('/setSession',(req, res)=>{
    //Podemos darle propiedades a las sesiones y setearlas
    req.session.user = 'userName'
    req.session.admin = true
    req.send('User loggeado')
})

app.get('/getSession',(req, res)=>{
    //Para obtener la session
    req.send(req.session)
})

//Para borrar una session
app.get('/logout',(req, res)=>{
    req.session.destroy((err)=>{
        if(err) res.send('Log out error')
        res.send('Usuario cerrado')
    })
})

//para bloquear la session a usuarion no loaggeados usamos un middleware
function auth(req, res, next){
    if(req.session.user = 'ayelen' && req.session.admin){
        return next()
    }
    return  res.send('Error en la autenticacion, usuario no autorizado')
    }

//Para hacer login
app.get('/login',(req, res)=>{
    let {username, password} = req.query
    if(username != 'ayelen' || password != 'micontrasena'){
        return res.send('usuario o password incorrectos')
    }
    req.session.user = username
    req.session.admin = true

    res.send('Usuarion loggeado')
})

app.get('/profile',auth, (req,res)=>{
    res.send('Usuarion loggeado exitosamente')
})


//Formateo de la data
app.use(express.json())

//Configurar carpeta estatica (publica)
app.use(express.static(__dirname +'/public'))

//Para inicializar handlebars dentro de mi aplicacion (configurar el motor de plantilla)
app.engine('handlebars', handlebars.engine())
//Para habilitar handlebrs para las siguientes views
app.set('view engine', 'handlebars')
//Para que express reconozca la carpeta views
app.set('views', __dirname, '/views')

//Me traigo mi router de home.router
const homeRouter = require('./routes/home.router.js')
//Inicializo mis rutas desde la carpeta principal para que las reconozca. El primer argumento va asobreponerse a todas las rutas que pertenecen a todas las rutas a las que quiera acceder
app.use('/home', homeRouter)

//Para conectarme con el cliente a traves de socket
const http =require('http')
//Server http
const server = http.createServer(app)
//Para inicializar el server
const {Server} = require('socket.io')
const io = new Server(server)
//Para escuchar la conexion
io.on('conection', (socket)=>{
    //Para enviar mensajes desde el servidor que luego va a tener que escuchar mi cliente
    socket.emit('welcome', 'hola')
    //Para escuchar el mensaje que esta enviando el cliente
    socket.on('new-product', (data)=>{
        arrProd.push(data)
        //utilizo la propiedad sockets de io para conectarme a varios sockes a la vez y no solo al que estoy usando yo
        io.sockets.emit('products-all', arrProd)
    })
})


//Tengo que escuchar a mi servidor
server.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
    // Conectar con Mongoose (Base de datos)
    Database.connect()
})


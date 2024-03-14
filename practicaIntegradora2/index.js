import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import { connect as DatabaseConnect } from './database.js';
import viewsRouter from './routes/views.routes.js';
import authRouter from './routes/auth.routes.js';
import { initPassport } from './passport/passport.js';
import passport from 'passport';
import {router as sessionRouter} from './routes/sessions.router.js'

//Implementando Json Web Token
import { Jwt } from 'jsonwebtoken';
const secret_key = "ClaveCoder"
export const generaToken = (usuario) =>jwt.sign(usuario,secret_key,{expiresIn: 60})
export const validaToken = (token) => jwt.verify(token, secret_key)

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8080;
const arrProd = [];
const db = require ('./routes/index.js')
const MongoStore = require('connect-mongo')
const passport = require ('passport')
const initializaePassport = require ('./passport/passport.js')
const useRouter = require('./routes/index.js')
const cookieParser = require('cookie-parser')
const {initializePassport, authorization} = require ('./passport/passport.js')

//ejecutamos el file de passport luego de importarlo aca
// initializaePassport()
initPassport()

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('coderSecret'));
--//Inicializamos passport
app.use(passport.initialize);
app.use(passport.session())
app.use('/api/sessions', sessionRouter)
app.use(session({
    secret: 'coderSecret',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://ayeueki:proyectoBackend1@proyectocoder.rxamsht.mongodb.net/'
    })
}));

// Configuración de Handlebars
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/home', homeRouter);
app.use('/views', viewsRouter);
app.use('/auth', authRouter);



// Manejo de Socket.IO
io.on('connection', (socket) => {
    socket.emit('welcome', 'hola');

    socket.on('new-product', (data) => {
        arrProd.push(data);
        io.sockets.emit('products-all', arrProd);
    });
});

// Conexión al Servidor y Base de Datos
server.listen(PORT, async () => {
    console.log(`Server on port ${PORT}`);
    try {
        await DatabaseConnect();
        console.log("Base de datos conectada");

        // Crear carrito y producto (ejemplo)
        // Cart.create(data);
        // Product.create({ name: 'Torta de chocolate', price: 7000, category: 'Tortas', stock: 5 });
    } catch (err) {
        console.error("Error al conectar a la base de datos:", err);
    }
});


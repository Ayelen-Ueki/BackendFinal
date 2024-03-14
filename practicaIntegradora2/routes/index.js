const express = require('express')
const {createHash, isValidatePassword} = require('../utils/bcryps')
const { create } = require('connect-mongo')
const {Router} = express
const router = new Router()
const users = []
const passport = require ('passport')
const jwt = require('jsonwebtoken')
const {authorization} = require ('../passport/passport')
import { generaToken } from '../index'


//Agregamos un middleware en Register utilizando una propiedad de passport que require el nombre de la estrategia que usamos antes en el file de passport.jsz
router.post('/register',passport.authenticate('register',{failureRedirect:'/user/failedRegister'}),(req,res)=>{
    res.send('Usuario registrado correctamente')
    let newUser = req.body
    newUser.id = Math.random()
    //Para guardar la password encriptada en mi base de datos
    newUser.password = createHash(userNew.password)
    users.push(newUser)
    res.send("User guardado correctamente")
})

router.post('/login',(req,res)=>{
    let newUser = req.body
    //Para ver si el usuario que esta tratando de ingresa esta en la base de datos
    let userFound = users.find(u=>{
        return u.email == newUser.email
    })
    //Para validar que la pass sea correcta para ese usuario
    if(userFound){
       if(!isValidatePassword(userFound, newUser.password)) res.send('usuario Inc$ npm install passport-localorrecto') 
       res.send('Usuario logueado correctamente')
    let token = generaToken(userFound)
    }
    return res.status(200).json({
        //Este token sirve para identificar si alguien estuvo modificando datos del cliente o no --> podemos confirmarlo en la pag de JWT 
        newUser: userFound, token
    })

    //Agregando doble proteccion con cookies
    if(req.body.username == 'ayeueki@gmail.com'&& req.body.password== '123456'){
        //Si se cumplen estas condiciones vamos a darle acceso al usuario a un token
        jwt.sign(
            {email: req.body.username, password: req.body.password, role:'admin'}, 
            'coderSecret', //Es el codigo que le vamos a dar al usuario si tiene acceso para poder ingresar
            {expiresIn:'24h'} //Para que expire en 24hs
        )
            res.cookie(cookieToken, token, {httpOnly:true}).send({message:'User logueado'})
            res.send({message:'User logueado',token})
    }
})

//Para usar la doble autenticacion con jwt con la estrategia que creamos en passport
router.get('/allUsers',passport.authenticate('jwt', {session:false}),authorization, (req,res)=>{
    req.send(users)
})

//Que pasa si falla mi registro
router.get('/failedRegister',(req,res)=>{
    res.send('el registro ha fallado')
})

router.get('logout', (req,res)=>{
    res.clearCookie('cookieToken').send('cookie eliminada')
})

//Ruta con parametro... con la expresion entre corchetes en el parametro podemos restringir lo que podemos incluir en el mismo 
router.get("/test/:word([a-zA-Z])",(req,res)=>{
    //Usamos json stringify para tomar lo que venga en el parametro y convertirlo en string
    res.send('Palabra: '+ JSON.stringify(req.params))
})

//El * nos sirve para todos aquellos casos que no cumplen con las condiciones de ninguna de las rutas que hayamos especificadoßß

router.get("*", (req,res)=>{
    req.status(404).send("La ruta no existe")
})
module.exports = router
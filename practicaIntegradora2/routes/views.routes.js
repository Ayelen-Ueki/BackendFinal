import authRouter from './routes/auth.routes.js';
const express = require('express')
const {Router} = express

const router = new Router()

function auth(req, res, next){
    req.session.user == newUser.user
}

router.get('/', (req, res)=>{
    //Para renderizar la vista que cree en home.handlebars
    res.render('home', {})
})

router.get('/login-view',(req,res)=>{
    res.render('login')
})

router.get('/register-view',(req,res)=>{
    res.render('register')
})

router.get('/profile-view',(req,res)=>{
    res.render('profile')
})



module.exports = router
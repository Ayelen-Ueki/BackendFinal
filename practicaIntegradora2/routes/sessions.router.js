import { Router } from "express";
import passport from "passport";
export const router = Router()

//"Github" es el nombre que yo le di a mi estrategia en "passport"
router.get('/',passport.authenticate('github',{}), (req, res) =>{


})

router.get('/callbackGithub', passport.authenticate('github',{}),(req,res)=>{
    
    //para grabar en la req de mi session los datos del user
    req.session.usuario=req.user
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({payload:req.user});
})


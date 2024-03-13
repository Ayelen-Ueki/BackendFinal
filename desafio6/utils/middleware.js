//Este middleware deberia implementarse cuando se quiere acceder al perfil del usuario
import { validaToken } from "../index"

export const auth=(req, res, next) => {
    //Para autenticar al usuario: Bearer Auth
    if(!req.headers["Authorization"]){
        res.setheader('Content-Type', 'application/json')
        return res.status(401).json({error:`Usuarion no autenticado`})
    }
    
    let token = req.headers['authorizarion'].split(" ")[1]
    // if(!validaToken(token)){
    //     res.setheader('Content-Type', 'application/json');
    //     return res.status(401).json({error:'Token invalido'})
    // }
    try{
        let usuario = validaToken(token)
        req.user = usuario
    } catch(error){
        res.setheader('Content-Type', 'application/json');
        return res.status(401).json({error:error.message})
    }
} 
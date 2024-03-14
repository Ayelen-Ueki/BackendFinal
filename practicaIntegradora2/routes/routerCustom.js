//Clase constructora de Rutas
const {Router} = require('express')

class routerCustom{
    //Constructor de ruta
    constructor(){
        this.router = Router(),
        //Inicializamos la fucnion init que va a ser usada por las clases de rutas que cree mas abajo
        this.init()
    }
    //Es para obtener this router --> Es lo mismo que exportar mi router
    getRouter(){
        return this.router
    }
    init(){}
    //Personalizando funciones
    get(path,...callBacks){
        this.router.get(path, this.applyCallbacks(callBacks))
    }
    //Callback a aplicar 
    applyCallbacks(callBacks){
        return callBacks.map(cb => async(...params)=>{
            try{
                await cb.apply(this, params)
            }catch(err){
                params[1].status(500).send(err)
            }
            
        })
    }
    generateCustomerResponse(req,res,next){
        res.sendSuccess = payload => res.send({status: "Success", payload})
    }
}
const Router = require('./routerCustom')

//Estoy heredando a la clase hija las propiedades de la clase padre que cree en routerCustoms
class UserRouter extends Router{
    //Viene de routerCustom
    init(){
        this.get('/',(req,res)=>{
            //res.send('Hola, mundo')
            res.sendSuccess('Hola mundo')
        })
    }
}

module.exports = UserRouter
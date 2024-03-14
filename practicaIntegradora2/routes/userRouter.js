const Router = require('./routerCustom')

class UserRouter extends Router{
    //Viene de routerCustom
    init(){
        this.get('/',(req,res)=>{
            res.send('Hola, mundo')
        })
    }
}

module.exports = UserRouter
import passport from 'passport';
import github from 'passport'
import usuariosModelo from '../db/models/user.model';

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const jwtStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const userModel = require('../db/models/user.model')
const{createHash,isValidatePassword}=require('../utils/bcryps')

//Aca vamos a hacer las configuraciones para el Registro y el Login

//Registro
// const initializaePassport = () =>{
//     //Vamos a usar las propiedades de passport. Use toma 2 argumentos, el nombre de la estrategia y la estrategia
//     passport.use('register', new LocalStrategy(
//         //Nuestro user name en este caso es el mismo email, que especificamos en el model que era unico para cada usuario
//         // Con passReqToCallBack le damos acceso a todas las propiedades del user
//         {usernameField: 'email',passReqToCallBack:true},
//         async(req, username, password, done)=>{
//             try{
//                 //Guardamos la info. del usuario que esta tratando de registrarse en una variable
//                 let userData = req.body
//                 let user = await userModel.findOne({email: username})
//                 if(user){
//                     //Si ya encuentra un usuario con ese mail deberia rechazar la peticion
//                     done('Error. El usuario ya existe', false)
//                 }
//                 let newUser={
//                     name: userData.name, 
//                     email: username, 
//                     lastname: userData.lastname,
//                     //Para encriptar las password
//                     password: createHash(userData.password),
//                     tel: userData.tel
//                 }
//                 //Guardo la info en mi modelo
//                 let result = await userModel.create(newUser)
//                 //Con null en done informo que no hay ningun error
//                 done(null, result)
//             }catch(err){
//                 //Si hay algun error envio un mensaje y este caso concateno el error del catch
//                 done('Error al crear usuario' + err)
//             }

//         }
//     ))
//     //Para hacer una encriptacion adicional la sesion
//     passport.serializeUser((user,done)=>{
//         done(null, user._id)
//     })
//     //Para desencriptarlo
//     passport.deserializeUser((id,done)=>{
//         let user = userModel.findbyId(id)
//         done(null,user)
//     })
// }


//Inicializar passport cuando quiero utulizar github para loggearme
// export const initPassport = () => {
//     Para usarla primero tengo que nombrar la estrategia que estoy usando y luego la estrategia
//     passport.use('github', new github.Strategy) (
//         argumentos de las  estrategias, 1 objeto para configurar la estrategia y 1 funcion con una firma relacionada con la estrategia
//         { //Datos tomados de la app que creamos en GitHub
//             clientId: 'Iv1.46ba0dbadbfd1c93',
//             clientSecret:'0bae53b354208e4fb6fe1f80a4801d4b692b6d56',
//             callbackURL:'http://localhost:3000/api/sessions/callback/Github'
//         },
//         Dicha funcion tiene que tener los siguientes argumentos
//         async(accessToken, refreshToken, profile, done) => {
//             try { //logica de registro/ login
//                 el name y el email del usuario los voy a estar tomando de su login en Github --> estan incluidos en _json
//                 let{name, email} = profile._json
//                 chequear si el usuario ya esta registrado o no chequeando sus datos contra mi modelo de usuario en la base de datos don de estan guardados todos los usuarios registrados
//                 let usuario = await usuariosModelo.findOne({email})
//                 return done (null, usuario)
//                 Si no se encuentra el usuario va a registrarlo y guardar su perfil de github
//                 if(!usuario){
//                     usuario = await usuariosModelo.create({
//                         nombre: name, email, github:profile
//                     })
//                 }
//             }catch(error){
//                 return done(error)
//             }
//         }
//     )
// }

// si usamos sessions, en ese caso estoy guardando el usuario completo suponinedo que no sea muy grande
// passport.serializeUser((usuario, done) => {
//     done(null, usuario)
// })

// passport.deserializeUser((usuario, done) => {
//     done(null, usuario)
// })

const initializePassport = () => {
    passport.use('jwt', new jwtStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'coderSecret'
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done('Error en JWT passport', error);
        }
    }));
};

const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

//Funcion para dar otro nivel de autorizacion (por ejemplo dependiendo del rol de la persona). Esta funcion va a devolver un middleware
const authorization = () => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: 'Unauthorized' });
        if (req.user.role !== 'admin') return res.status(403).send({ error: 'No tiene permiso' });
        next();
    };
};


//Vamos a usar esta funcion como middle ware para las funciones que consideremos que deberian estar protegidas
module.exports = {initializePassport, authorization}
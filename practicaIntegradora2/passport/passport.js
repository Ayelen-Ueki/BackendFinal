import passport from ('passport');
import LocalStrategy from ('passport-local').Strategy;
import jwtStrategy from ('passport-jwt').Strategy;
import ExtractJWT from ('passport-jwt').ExtractJwt;
import userModel from ('../db/models/user.model');
import { createHash, isValidatePassword } from ('../utils/bcryps');

//Registro
const initializePassport = () => {
    // Usar Local Strategy para el registro de usuarios
    passport.use('register', new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                // Chequear si el usuario ya existe
                let user = await userModel.findOne({ email: username });
                if (user) {
                    done('Error. El usuario ya existe', false);
                }
                // Crear un nuevo usuario
                let newUser = {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: username,
                    password: createHash(password),
                    role: req.body.role 
                };
                let result = await userModel.create(newUser);
                done(null, result);
            } catch (err) {
                done('Error al crear usuario' + err);
            }
        }
    ));

    // Serializar y deserializar el usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        userModel.findById(id, (err, user) => {
            done(err, user);
        });
    });
};

// Inicializar passport para GitHub login
export const initPassport = () => {
    passport.use('github', new github.Strategy(
        {
            clientID: 'Iv1.46ba0dbadbfd1c93',
            clientSecret: '0bae53b354208e4fb6fe1f80a4801d4b692b6d56',
            callbackURL: 'http://localhost:3000/api/sessions/callback/Github'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let { name, email } = profile._json;
                let usuario = await userModel.findOne({ email });
                if (!usuario) {
                    usuario = await userModel.create({
                        first_name: name,
                        last_name: '', 
                        email,
                        github: profile,
                        role: 'user' 
                    });
                }
                done(null, usuario);
            } catch (error) {
                done(error);
            }
        }
    ));
};

// Usar JWT para autenticacion
const initializeJWTStrategy = () => {
    passport.use('jwt', new jwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'coderSecret'
        },
        async (jwt_payload, done) => {
            try {
                let user = await userModel.findById(jwt_payload.sub);
                if (!user) {
                    return done(null, false);
                }
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    ));
};

// Extrar el token de JWT para cookies
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

// Middleware for authorization based on user role
const authorization = () => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: 'Unauthorized' });
        if (req.user.role !== 'admin') return res.status(403).send({ error: 'No tiene permiso' });
        next();
    };
};

// Inicializar todas las estrategisa de passport
const initializePassportStrategies = () => {
    initializePassport();
    initPassport();
    initializeJWTStrategy();
};

// Export
initializePassportStrategies();
export default passport;
export { authorization };

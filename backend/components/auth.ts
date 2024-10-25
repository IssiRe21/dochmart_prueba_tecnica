import environment from './environment';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
// const LocalStrategy = require('passport-local').Strategy;
// const passportJWT = require('passport-jwt');
// const JWTStrategy = passportJWT.Strategy;
// const ExtractJwt = passportJWT.ExtractJwt;

// eslint-disable-next-line @typescript-eslint/no-namespace
import User from '../models/user.model';

declare global {
    namespace Express {
        interface User {
            id: number,
            name: string,
            email: string,
        }
    }
}


// Autenticación usando Passport con estrategias de JWT + local

/**
 * Rutas que requieren autenticación necesitan enviar el token en cada request que lo requiera.
 * 
 * ---
 * 
 * Cuando useAuthorizationHeader es true, el token se debe enviar en un header:
 * 
 * `'Authorization': 'Bearer <token>'`
 * 
 * Cuando useAuthorizationHeader es false, el token se debe enviar en un query param:
 * 
 * `?secret_token=<token>`
 * 
 */
const useAuthorizationHeader = true;


const jwtQueryParamName = 'secret_token';

// No es posible incluir campos adicionales, por lo que la funcionalidad completa de signup
// se encuentra en auth.routes.ts
// passport.use(
//     'signup',
//     new LocalStrategy(
//         {
//             usernameField: 'email',
//             passwordField: 'password'
//         },
//         async (email, password, done) => {
//             try {
//                 // Crear en base de datos, sin guardar al usuario
//                 const user = await User.build({ email, password });
    
//                 // Hacer hash al password
//                 await user.hashPassword();

//                 // Guardar en base de datos
//                 await user.save();

//                 return done(null, user);
//             } catch (error) {
//                 done(error);
//             }
//         }
//     )
// );

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({
                    where: {
                        email,
                    },
                });
        
                if (!user) {
                    // Para prevenir el mal uso del inicio de sesión para "consultar" si un usuario existe o no,
                    // usamos el mismo mensaje de error que cuando las credenciales son incorrectas
                    return done(null, false, { message: 'Usuario o contraseña incorrectos' });
                    // return done(null, false, { message: 'Usuario no encontrado' });
                }
                
                const passwordMatches = await user.verifyPassword(password);
                
                if (!passwordMatches) {
                    return done(null, false, { message: 'Usuario o contraseña incorrectos' });
                }
        
                return done(null, user, { message: 'Inicio de sesión exitoso' });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            secretOrKey: environment.jwt.secret,
            jwtFromRequest: useAuthorizationHeader ? ExtractJwt.fromAuthHeaderAsBearerToken() : ExtractJwt.fromUrlQueryParameter(jwtQueryParamName),
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

/**
 * Middleware que verifica el token JWT y agrega el usuario actual a req.user, o arroja un error en caso de que el 
 * token no sea válido
 */
export const authMiddleware = passport.authenticate('jwt', { session: false });
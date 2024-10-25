// TODOs

// ---commands---
// npm init
// npm install express
// npm install dotenv
// npm install cors
// npm install passport
// npm install express-session
// npm install sequelize
// npm install mysql2
// npm install bcrypt
// npm install jsonwebtoken

// this one is a single line (better)
// ||
// \/
// npm install express dotenv cors passport express-session sequelize mysql2 bcrypt jsonwebtoken



// npx ts-node index.ts

// npm i --save-dev @types/passport @types/passport-local @types/passport-jwt

// npm i sequelize@6.6.2

// npm i passport-local passport-jwt

// npm i -D @types/express@4


import environment from './components/environment';
import Database from "./components/database";

// Servidor de express
import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';

// Autenticación
import session from "express-session";
import passport from "passport";
import "./components/auth";

// Rutas
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

/**
 * Verifica la conexión a la base de datos, e inicializa el servidor de express con sus rutas
 */
async function initServer() {
    try {
        // La librería Sequelize para base de datos requiere un acomodo especial para
        // asegurarse que la base de datos se autentique correctamente
        // Basado en: https://stackoverflow.com/questions/60942051/sequelize-with-asynchronous-configuration-in-nodejs
        await Database.setup();
    } catch (error) {
        console.error('No fue posible conectarse a la base de datos:', error);
        return;
    }
    
    const app = express();
    
    app.use(bodyParser.urlencoded({ extended: false }));

    // Permitir peticiones desde el cliente (ej. http://localhost:4200 en desarrollo), 
    // cuando el backend se encuentra en una url distinta al cliente (CORS)
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    const corsOptions = {
        origin: environment.cors.clientOrigin,
    };
    app.use(cors(corsOptions));
    
    // Rutas de autenticación
    app.use('/auth', authRoutes);
    
    // Rutas de usuario
    app.use('/user', userRoutes);
    
    // Iniciar servidor de express
    const port = environment.server.port;
    try {
        app.listen(port, () => {
            console.log(`Servidor iniciado`)
        });
    } catch (error) {
        console.error('No fue posible iniciar el servidor de express:', error);
        return;
    }
}

initServer();
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import environment from '../components/environment';
import { authMiddleware } from '../components/auth';
import User from '../models/user.model';

const router = express.Router();

// https://emailregex.com/index.html
const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

router.post('/signup', async (req, res, next) => {
    const name = req.body?.name;
    const email = req.body?.email;
    const password = req.body?.password;
    const passwordConfirm = req.body?.passwordConfirm;

    if (!name || name === "") {
        const err = new Error("Por favor introduce un nombre válido");
        res.status(400);
        return next(err);
    }

    if (!email || email === "" || !email.match(emailRegExp)) {
        const err = new Error("Por favor introduce un email válido");
        res.status(400);
        return next(err);
    }

    if (!password || password === "") {
        const err = new Error("Por favor introduce un password válido");
        res.status(400);
        return next(err);
    }
    
    if (password !== passwordConfirm) {
        const err = new Error("Por favor verifica que las contraseñas coincidan");
        res.status(400);
        return next(err);
    }

    try {
        // Crear en base de datos, sin guardar al usuario
        const user = await User.build({
            name,
            email,
            password,
        });


        // Hacer hash al password
        await user.hashPassword();

        // Guardar en base de datos
        await user.save();

        return res.status(200).send();
    } catch (error) {
        next(error);
    }
});

// Requiere enviar campos email y password en el body
router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, user, info) => {
            try {
                if (err || !user) {
                    res.status(401);
                    return next(err);
                }
    
                req.login(
                    user,
                    {
                        session: false
                    },
                    async (error) => {
                        if (error) {
                            return next(error);
                        };
        
                        const body = {
                            id: user.id,
                            email: user.email,
                        };
                        const token = jwt.sign({ user: body }, environment.jwt.secret);
        
                        return res.json({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            token,
                        });
                    }
                );
            } catch (error) {
                return next(error);
            }
            }
        )(req, res, next);
    }
);

router.post('/logout', authMiddleware, function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        return res.status(200).send();
    });
});


export default router;
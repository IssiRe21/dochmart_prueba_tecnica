import express, { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import { format } from 'date-fns';
const router = express.Router();

import User from '../models/user.model';
import environment from '../components/environment';
import { authMiddleware } from '../components/auth';

router.get('/current', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const reqUser = req.user;

    if (!reqUser) {
        res.status(401);
        return next(new Error("Acceso denegado"));
    }
    
    // reqUser solo tiene id e email
    const user = await User.findOne({
        where: {
            email: reqUser.email,
        },
    });

    if (!user) {
        res.status(404);
        return next(new Error("Usuario no encontrado"));
    }

    return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toUTCString(),
    });
});

router.get('/report', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const reqUser = req.user;

    if (!reqUser) {
        res.status(401);
        return next(new Error("Acceso denegado"));
    }
    
    // reqUser solo tiene id e email
    const user = await User.findOne({
        where: {
            email: reqUser.email,
        },
    });

    if (!user) {
        res.status(404);
        return next(new Error("Usuario no encontrado"));
    }


    // Parámetros para servicio de reporte
    const params = new URLSearchParams();
    
    params.append('id', user.id.toString());
    params.append('name', user.name);
    params.append('email', user.email);
    const dateFormat = "dd/MM/yyyy";
    params.append('createdAt', format(user.createdAt, dateFormat));
    
    // Consultar servicio de reporte
    const fetchResponse = await fetch(
        environment.services.userReportUrl, 
        {
            method: 'post',
            body: params,
        }
    );

    // Reenviar respuesta de servicio al cliente como respuesta
    fetchResponse.body?.pipe(res);
});

export default router;
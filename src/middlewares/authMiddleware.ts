import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    usuario?: any;
}


export const verificarJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: "No se proporcionó un token" });
    }

    const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;
    const secreto = process.env.JWT_SECRET || 'clave_secreta_provisoria';

    jwt.verify(tokenLimpio, secreto, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido o expirado" });
        }
        req.usuario = decoded;
        next();
    });
};
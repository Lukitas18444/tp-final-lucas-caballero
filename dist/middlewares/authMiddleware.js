"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verificarJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: "No se proporcionó un token" });
    }
    const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;
    const secreto = process.env.JWT_SECRET || 'clave_secreta_provisoria';
    jsonwebtoken_1.default.verify(tokenLimpio, secreto, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido o expirado" });
        }
        req.usuario = decoded;
        next();
    });
};
exports.verificarJWT = verificarJWT;

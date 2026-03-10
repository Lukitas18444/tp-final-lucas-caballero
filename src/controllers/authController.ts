import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as AuthModel from '../models/authModel';

export const login = async (req: Request, res: Response) => {
    try {
        const { matricula, password } = req.body;

        const veterinario = await AuthModel.buscarVeterinario(matricula);

        if (!veterinario) {
            return res.status(401).json({ error: "No existe el veterinario" });
        }

        const esCorrecta = await bcrypt.compare(password, veterinario.password || '');

        if (!esCorrecta) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: veterinario.id, nombre: veterinario.nombre },
            process.env.JWT_SECRET || 'clave_secreta_provisoria',
            { expiresIn: '2h' }
        );

        res.json({ token });
    } catch (error) {
        console.error("ERROR CRÍTICO:", error);
        res.status(500).json({ error: "Error interno" });
    }
};
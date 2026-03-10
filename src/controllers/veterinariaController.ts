import { Request, Response } from 'express';
import * as Model from '../models/veterinariaModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    const { matricula, password } = req.body;
    const vete = await Model.findVeterinarioByMatricula(matricula);

    if (!vete || !(await bcrypt.compare(password, vete.password))) {
        return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: vete.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
    res.json({ token });
};

export const listarHistorial = async (req: Request, res: Response) => {
    try {
        const datos = await Model.getHistorialCompleto();
        res.json(datos);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener historial" });
    }
};


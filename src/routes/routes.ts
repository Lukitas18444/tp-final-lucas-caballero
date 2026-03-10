import { Router, Response } from 'express'; 
import * as Controller from '../controllers/veterinariaController';
import { verificarJWT, AuthRequest } from '../middlewares/authMiddleware';
import pool from '../db'; 

const router = Router();



router.get('/historial', verificarJWT, Controller.listarHistorial);

router.get('/duenos', verificarJWT, async (req: AuthRequest, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT id, CONCAT(nombre, " ", apellido) AS nombre_completo FROM duenos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener dueños" });
    }
});

router.post('/mascotas', verificarJWT, async (req: AuthRequest, res: Response) => {
    const { nombre, especie, fecha_de_nacimiento, dueno_nombre_completo } = req.body;

    if (!nombre || !especie || !dueno_nombre_completo) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
        const partes = dueno_nombre_completo.split(' ');
        const nombreDueno = partes[0];
        const apellidoDueno = partes.slice(1).join(' ') || 'Sin Apellido';

        const [duenos] = await pool.query<any[]>(
            'SELECT id FROM duenos WHERE nombre = ? AND apellido = ?',
            [nombreDueno, apellidoDueno]
        );

        let duenoId: number;

        if (duenos.length > 0) {
            duenoId = duenos[0].id;
        } else {
            const [result] = await pool.execute(
                'INSERT INTO duenos (nombre, apellido, telefono) VALUES (?, ?, ?)',
                [nombreDueno, apellidoDueno, '000-0000']
            ) as any;
            duenoId = result.insertId;
        }

        await pool.execute(
            'INSERT INTO mascotas (nombre, especie, fecha_de_nacimiento, dueno_id) VALUES (?, ?, ?, ?)',
            [nombre, especie, fecha_de_nacimiento, duenoId]
        );

        res.status(201).json({ mensaje: "Mascota y dueño procesados con éxito" });
    } catch (err) {
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
});

router.delete('/mascotas/:id', verificarJWT, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM mascotas WHERE id = ?', [id]);
        res.json({ mensaje: `Mascota con ID ${id} eliminada.` });
    } catch (err) {
        res.status(500).json({ error: "No se pudo eliminar." });
    }
});

export default router;
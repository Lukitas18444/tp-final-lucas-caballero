const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



app.use(cors());
app.use(express.json());




app.post('/login', async (req, res) => {
    try {
        const { matricula, password } = req.body;

        const [rows] = await pool.query('SELECT * FROM veterinarios WHERE matricula = ?', [matricula]);

        if (rows.length === 0) {
            console.log("Resultado: Matrícula no encontrada en DB");
            return res.status(401).json({ error: "No existe el veterinario" });
        }

        const veterinario = rows[0];
        console.log("Hash en DB:", veterinario.password);

        const esCorrecta = await bcrypt.compare(password, veterinario.password);
        console.log("La contraseña coincide?:", esCorrecta);

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
});

app.post('/mascotas',  async (req, res) => {
    const { nombre, especie, fecha_de_nacimiento, dueno_nombre_completo } = req.body;

    if (!nombre || !especie || !dueno_nombre_completo) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
        
        const partes = dueno_nombre_completo.split(' ');
        const nombreDueno = partes[0];
        const apellidoDueno = partes.slice(1).join(' ') || 'Sin Apellido';


        const [duenos] = await pool.query(
            'SELECT id FROM duenos WHERE nombre = ? AND apellido = ?',
            [nombreDueno, apellidoDueno]
        );

        let duenoId;

        if (duenos.length > 0) {
            
            duenoId = duenos[0].id;
        } else {
            
            const [nuevoDueno] = await pool.execute(
                'INSERT INTO duenos (nombre, apellido, telefono) VALUES (?, ?, ?)',
                [nombreDueno, apellidoDueno, '000-0000']
            );
            duenoId = nuevoDueno.insertId;
        }

        
        await pool.execute(
            'INSERT INTO mascotas (nombre, especie, fecha_de_nacimiento, dueno_id) VALUES (?, ?, ?, ?)',
            [nombre, especie, fecha_de_nacimiento, duenoId]
        );

        res.status(201).json({ mensaje: "Mascota y dueño procesados con éxito" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
});

const verificarJWT = (req, res, next) => {
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

app.use((req, res, next) => {
    console.log(`${req.method} realizado a ${req.url}`);
    next();
});


app.get('/historial', verificarJWT, async (req, res) => {
    try {
        const sql = `
    SELECT 
        m.id, 
        m.nombre AS mascota, 
        m.especie, 
        CONCAT(d.nombre, ' ', d.apellido) AS dueno,
        COALESCE(h.descripcion, 'Sin registros todavía') AS descripcion, 
        h.fecha_de_registro
    FROM mascotas m
    JOIN duenos d ON m.dueno_id = d.id
    LEFT JOIN historial_clinico h ON m.id = h.mascota_id;
`;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/duenos', verificarJWT, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, CONCAT(nombre, " ", apellido) AS nombre_completo FROM duenos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener dueños" });
    }
});

app.delete('/mascotas/:id', verificarJWT, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM mascotas WHERE id = ?', [id]);
        res.json({ mensaje: `Mascota con ID ${id} eliminada.` });
    } catch (err) {
        res.status(500).json({ error: "No se pudo eliminar." });
    }
});



bcrypt.hash('admin123', 10).then(hash => {
    console.log("USA ESTE HASH EXACTO EN TU SQL PARA ADMIN123:");
    console.log(hash);
});



app.listen(3000, () => console.log("Servidor Backend corriendo en el puerto 3000"));
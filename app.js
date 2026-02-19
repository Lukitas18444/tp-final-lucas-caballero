const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



app.use(cors());
app.use(express.json());




app.post('/login', async (req, res) => {
    try {
        const { matricula, password } = req.body;
        console.log("--- INTENTO DE LOGIN ---");
        console.log("Matricula ingresada:", matricula);
        console.log("Password ingresada:", password);

        const [rows] = await pool.query('SELECT * FROM veterinarios WHERE matricula = ?', [matricula]);

        if (rows.length === 0) {
            console.log("Resultado: Matrícula no encontrada en DB");
            return res.status(401).json({ error: "No existe el veterinario" });
        }

        const veterinario = rows[0];
        console.log("Hash en DB:", veterinario.password);

        // Comparación manual para descartar errores de bcrypt
        const esCorrecta = await bcrypt.compare(password, veterinario.password);
        console.log("¿La contraseña coincide?:", esCorrecta);

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

const verificarJWT = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: "No se proporcionó un token" });
    }

    // El token suele venir como "Bearer <token>", así que lo limpiamos
    const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(tokenLimpio, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido o expirado" });
        }
        req.usuario = decoded; // Guardamos los datos del vet en la petición
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
            SELECT h.id, m.nombre AS mascota, m.especie, 
            CONCAT(d.nombre, ' ', d.apellido) AS dueno,
            h.descripcion, h.fecha_de_registro
            FROM historial_clinico h
            JOIN mascotas m ON h.mascota_id = m.id
            JOIN duenos d ON m.dueno_id = d.id;
        `;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
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







app.listen(3000, () => console.log("Servidor Backend corriendo en el puerto 3000"));
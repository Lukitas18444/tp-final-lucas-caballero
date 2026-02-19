const express = require('express');
const cors = require('cors');
const pool = require('./db'); // El archivo de conexión a MySQL
const app = express();



app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    console.log(`${req.method} realizado a ${req.url}`);
    next();
});


app.get('/historial', async (req, res) => {
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

app.delete('/mascotas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM mascotas WHERE id = ?', [id]);
        res.json({ mensaje: `Mascota con ID ${id} eliminada.` });
    } catch (err) {
        res.status(500).json({ error: "No se pudo eliminar." });
    }
});



const revisarToken = (req, res, next) => {
    const tokenRecibido = req.headers['authorization'];
    const TOKEN_SECRETO = "Pikachu123";

    if (tokenRecibido === TOKEN_SECRETO) {
        next(); 
    } else {
        res.status(401).json({ error: "Acceso denegado. Token inválido o inexistente." });
    }
};

app.delete('/mascotas/:id', revisarToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM mascotas WHERE id = ?', [id]);
        res.json({ mensaje: `Registro ${id} eliminado con éxito.` });
    } catch (err) {
        res.status(500).json({ error: "Error en la base de datos." });
    }
});

// ...
app.use(cors()); // Antes de las rutas

app.listen(3000, () => console.log("Servidor Backend corriendo en el puerto 3000"));
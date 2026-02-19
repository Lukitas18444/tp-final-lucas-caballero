const express = require('express');
const pool = require('./db'); 
const app = express();

app.use(express.json());


app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const validarRegistro = (req, res, next) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  next();
};

app.post('/usuarios', validarRegistro, async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [nombre, email, password]);
    
    res.status(201).json({ id: result.insertId, nombre, email });
  } catch (err) {
    res.status(500).json({ error: "Error al insertar en la DB" });
  }
});

app.listen(3000, () => console.log("Servidor MySQL en puerto 3000"));
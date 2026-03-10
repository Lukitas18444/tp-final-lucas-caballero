import pool from '../db'; 

export const findVeterinarioByMatricula = async (matricula: string) => {
    const [rows] = await pool.query<any[]>('SELECT * FROM veterinarios WHERE matricula = ?', [matricula]);
    return rows[0];
};


export const getHistorialCompleto = async () => {
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
    return rows;
};

export const getTodosLosDuenos = async () => {
    const [rows] = await pool.query('SELECT id, CONCAT(nombre, " ", apellido) AS nombre_completo FROM duenos');
    return rows;
};
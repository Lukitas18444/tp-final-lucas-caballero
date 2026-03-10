import pool from '../db';

export interface Veterinario {
    id: number;
    nombre: string;
    matricula: string;
    password?: string;
}

export const buscarVeterinario = async (matricula: string): Promise<Veterinario | null> => {
    const [rows] = await pool.query<any[]>('SELECT * FROM veterinarios WHERE matricula = ?', [matricula]);
    return rows.length > 0 ? (rows[0] as Veterinario) : null;
};
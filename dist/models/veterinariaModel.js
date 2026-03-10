"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodosLosDuenos = exports.getHistorialCompleto = exports.findVeterinarioByMatricula = void 0;
const db_1 = __importDefault(require("../db"));
const findVeterinarioByMatricula = (matricula) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_1.default.query('SELECT * FROM veterinarios WHERE matricula = ?', [matricula]);
    return rows[0];
});
exports.findVeterinarioByMatricula = findVeterinarioByMatricula;
const getHistorialCompleto = () => __awaiter(void 0, void 0, void 0, function* () {
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
    const [rows] = yield db_1.default.query(sql);
    return rows;
});
exports.getHistorialCompleto = getHistorialCompleto;
const getTodosLosDuenos = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_1.default.query('SELECT id, CONCAT(nombre, " ", apellido) AS nombre_completo FROM duenos');
    return rows;
});
exports.getTodosLosDuenos = getTodosLosDuenos;

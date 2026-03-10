"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = require("express"); // Quitamos Request porque usás AuthRequest
const Controller = __importStar(require("../controllers/veterinariaController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// ❌ BORRAMOS la línea de router.post('/login'...) de acá.
router.get('/historial', authMiddleware_1.verificarJWT, Controller.listarHistorial);
// Agregamos la de dueños que te faltaba para que no de error el autocompletado
router.get('/duenos', authMiddleware_1.verificarJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT id, CONCAT(nombre, " ", apellido) AS nombre_completo FROM duenos');
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: "Error al obtener dueños" });
    }
}));
router.post('/mascotas', authMiddleware_1.verificarJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, especie, fecha_de_nacimiento, dueno_nombre_completo } = req.body;
    if (!nombre || !especie || !dueno_nombre_completo) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    try {
        const partes = dueno_nombre_completo.split(' ');
        const nombreDueno = partes[0];
        const apellidoDueno = partes.slice(1).join(' ') || 'Sin Apellido';
        const [duenos] = yield db_1.default.query('SELECT id FROM duenos WHERE nombre = ? AND apellido = ?', [nombreDueno, apellidoDueno]);
        let duenoId;
        if (duenos.length > 0) {
            duenoId = duenos[0].id;
        }
        else {
            const [result] = yield db_1.default.execute('INSERT INTO duenos (nombre, apellido, telefono) VALUES (?, ?, ?)', [nombreDueno, apellidoDueno, '000-0000']);
            duenoId = result.insertId;
        }
        yield db_1.default.execute('INSERT INTO mascotas (nombre, especie, fecha_de_nacimiento, dueno_id) VALUES (?, ?, ?, ?)', [nombre, especie, fecha_de_nacimiento, duenoId]);
        res.status(201).json({ mensaje: "Mascota y dueño procesados con éxito" });
    }
    catch (err) {
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
}));
router.delete('/mascotas/:id', authMiddleware_1.verificarJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.execute('DELETE FROM mascotas WHERE id = ?', [id]);
        res.json({ mensaje: `Mascota con ID ${id} eliminada.` });
    }
    catch (err) {
        res.status(500).json({ error: "No se pudo eliminar." });
    }
}));
exports.default = router;

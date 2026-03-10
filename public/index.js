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
const contenedor = document.getElementById('lista-historial');
const seccionLogin = document.getElementById('seccion-login');
const seccionPanel = document.getElementById('seccion-panel');
const formLogin = document.getElementById('form-login');
const formMascota = document.getElementById('form-mascota');
const obtenerHistorial = () => __awaiter(void 0, void 0, void 0, function* () {
    const token = localStorage.getItem('token_vet');
    try {
        const respuesta = yield fetch('http://localhost:3000/api/historial', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!respuesta.ok) {
            if (respuesta.status === 401)
                logout();
            return;
        }
        const datos = yield respuesta.json();
        contenedor.innerHTML = '';
        if (datos.length === 0) {
            contenedor.innerHTML = '<p>No hay pacientes con historial todavía.</p>';
            return;
        }
        datos.forEach(item => {
            contenedor.innerHTML += `
                <div style="border: 1px solid #444; margin: 10px; padding: 10px; border-radius: 5px;">
                    <h4>${item.mascota} (${item.especie})</h4>
                    <p><strong>Dueño:</strong> ${item.dueno}</p>
                    <p><strong>Nota:</strong> ${item.descripcion || 'Sin registros'}</p>
                    <p><small>Fecha: ${item.fecha_de_registro ? new Date(item.fecha_de_registro).toLocaleDateString() : 'N/A'}</small></p>
                    <button onclick="eliminarMascota(${item.id})" style="background:#e74c3c; color:white; border:none; padding:5px; cursor:pointer;">Eliminar</button>
                </div>
            `;
        });
    }
    catch (err) {
        console.error("Error al obtener historial:", err);
    }
});
formLogin.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const matricula = document.getElementById('matricula').value;
    const password = document.getElementById('password-login').value;
    try {
        const res = yield fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricula, password })
        });
        const data = yield res.json();
        if (res.ok) {
            localStorage.setItem('token_vet', data.token);
            verificarEstado();
        }
        else {
            alert(data.error);
        }
    }
    catch (err) {
        alert("Error al conectar con el servidor");
    }
}));
window.eliminarMascota = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const token = localStorage.getItem('token_vet');
    if (!confirm("¿Seguro que quieres borrar este registro?"))
        return;
    try {
        const res = yield fetch(`http://localhost:3000/api/mascotas/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            alert("Borrado con éxito");
            obtenerHistorial();
        }
        else {
            const err = yield res.json();
            alert("Error: " + err.error);
        }
    }
    catch (err) {
        alert("Error de conexión");
    }
});
const verificarEstado = () => {
    const token = localStorage.getItem('token_vet');
    if (token) {
        seccionLogin.style.display = 'none';
        seccionPanel.style.display = 'block';
        obtenerHistorial();
        cargarDatalistDuenos();
    }
    else {
        seccionLogin.style.display = 'block';
        seccionPanel.style.display = 'none';
    }
};
const logout = () => {
    localStorage.removeItem('token_vet');
    verificarEstado();
};
const btnLogout = document.getElementById('btn-logout');
if (btnLogout)
    btnLogout.onclick = logout;
formMascota.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const token = localStorage.getItem('token_vet');
    const nuevaMascota = {
        nombre: document.getElementById('m-nombre').value,
        especie: document.getElementById('m-especie').value,
        fecha_de_nacimiento: document.getElementById('m-fecha').value,
        dueno_nombre_completo: document.getElementById('m-dueno').value
    };
    try {
        const res = yield fetch('http://localhost:3000/api/mascotas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(nuevaMascota)
        });
        if (res.ok) {
            alert("Mascota agregada con éxito");
            formMascota.reset();
            obtenerHistorial();
            cargarDatalistDuenos();
        }
        else {
            const err = yield res.json();
            alert("Error: " + err.error);
        }
    }
    catch (err) {
        alert("Error de conexión");
    }
}));
const cargarDatalistDuenos = () => __awaiter(void 0, void 0, void 0, function* () {
    const token = localStorage.getItem('token_vet');
    const datalist = document.getElementById('lista-duenos');
    try {
        const res = yield fetch('http://localhost:3000/api/duenos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const duenos = yield res.json();
        datalist.innerHTML = '';
        duenos.forEach(d => {
            const option = document.createElement('option');
            option.value = d.nombre_completo;
            datalist.appendChild(option);
        });
    }
    catch (err) {
        console.error("Error al cargar autocompletado de dueños:", err);
    }
});
verificarEstado();

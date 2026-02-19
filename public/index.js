const contenedor = document.getElementById('lista-historial');
const seccionLogin = document.getElementById('seccion-login');
const seccionPanel = document.getElementById('seccion-panel');
const formLogin = document.getElementById('form-login');

// --- 1. FUNCIÓN OBTENER HISTORIAL (Corregida con Token) ---
const obtenerHistorial = async () => {
    const token = localStorage.getItem('token_vet');
    
    try {
        const respuesta = await fetch('http://localhost:3000/historial', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}` // <--- IMPORTANTE
            }
        });

        if (!respuesta.ok) {
            if(respuesta.status === 401) logout(); // Si el token venció, afuera
            return;
        }

        const datos = await respuesta.json();
        contenedor.innerHTML = ''; 
        datos.forEach(item => {
            contenedor.innerHTML += `
                <div style="border: 1px solid #444; margin: 10px; padding: 10px;">
                    <h4>${item.mascota} (${item.especie})</h4>
                    <p><strong>Dueño:</strong> ${item.dueno}</p>
                    <p><strong>Nota:</strong> ${item.descripcion}</p>
                    <button onclick="eliminarMascota(${item.id})">Eliminar Registro</button>
                </div>
            `;
        });
    } catch (err) {
        console.error("Error al obtener historial:", err);
    }
};

// --- 2. FUNCIÓN LOGIN (Limpia) ---
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const matricula = document.getElementById('matricula').value;
    const password = document.getElementById('password-login').value;

    try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricula, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token_vet', data.token);
            verificarEstado(); 
        } else {
            alert(data.error); // Aquí verás si es "Contraseña incorrecta"
        }
    } catch (err) {
        alert("Error al conectar con el servidor");
    }
});

// --- 3. ELIMINAR MASCOTA ---
window.eliminarMascota = async (id) => {
    const token = localStorage.getItem('token_vet');
    if (!confirm("¿Seguro que quieres borrar este registro?")) return;

    try {
        const res = await fetch(`http://localhost:3000/mascotas/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            alert("Borrado con éxito");
            obtenerHistorial();
        } else {
            const err = await res.json();
            alert("Error: " + err.error);
        }
    } catch (err) {
        alert("Error de conexión");
    }
};

// --- 4. ESTADO Y LOGOUT ---
const verificarEstado = () => {
    const token = localStorage.getItem('token_vet');
    if (token) {
        seccionLogin.style.display = 'none';
        seccionPanel.style.display = 'block';
        obtenerHistorial();
    } else {
        seccionLogin.style.display = 'block';
        seccionPanel.style.display = 'none';
    }
};

const logout = () => {
    localStorage.removeItem('token_vet');
    verificarEstado();
};

document.getElementById('btn-logout').onclick = logout;

// Iniciar app
verificarEstado();
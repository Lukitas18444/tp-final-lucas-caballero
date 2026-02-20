const contenedor = document.getElementById('lista-historial');
const seccionLogin = document.getElementById('seccion-login');
const seccionPanel = document.getElementById('seccion-panel');
const formLogin = document.getElementById('form-login');


const obtenerHistorial = async () => {
    const token = localStorage.getItem('token_vet');
    
    try {
        const respuesta = await fetch('http://localhost:3000/historial', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });

        if (!respuesta.ok) {
            if(respuesta.status === 401) logout();
            return;
        }

        const datos = await respuesta.json();
     
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
    } catch (err) {
        console.error("Error al obtener historial:", err);
    }
};


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
            alert(data.error); 
        }
    } catch (err) {
        alert("Error al conectar con el servidor");
    }
});


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


const verificarEstado = () => {
    const token = localStorage.getItem('token_vet');
    if (token) {
        seccionLogin.style.display = 'none';
        seccionPanel.style.display = 'block';
        obtenerHistorial();
        cargarDatalistDuenos();
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


const formMascota = document.getElementById('form-mascota');

formMascota.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token_vet');
    const nuevaMascota = {
        nombre: document.getElementById('m-nombre').value,
        especie: document.getElementById('m-especie').value,
        fecha_de_nacimiento: document.getElementById('m-fecha').value,
        dueno_nombre_completo: document.getElementById('m-dueno').value
    };

    try {
        const res = await fetch('http://localhost:3000/mascotas', {
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
        } else {
            const err = await res.json();
            alert("Error: " + err.error);
        }
    } catch (err) {
        alert("Error de conexión");
    }
});

const cargarDatalistDuenos = async () => {
    const token = localStorage.getItem('token_vet');
    const datalist = document.getElementById('lista-duenos');

    try {
        const res = await fetch('http://localhost:3000/duenos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const duenos = await res.json();

        datalist.innerHTML = '';
        duenos.forEach(d => {
            const option = document.createElement('option');
            option.value = d.nombre_completo; 
            datalist.appendChild(option);
        });
    } catch (err) {
        console.error("Error al cargar autocompletado de dueños:", err);
    }
};


verificarEstado();
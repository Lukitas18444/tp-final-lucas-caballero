const contenedor = document.getElementById('lista-historial') as HTMLDivElement;
const seccionLogin = document.getElementById('seccion-login') as HTMLElement;
const seccionPanel = document.getElementById('seccion-panel') as HTMLElement;
const formLogin = document.getElementById('form-login') as HTMLFormElement;
const formMascota = document.getElementById('form-mascota') as HTMLFormElement;

interface HistorialItem {
    id: number;
    mascota: string;
    especie: string;
    dueno: string;
    descripcion: string;
    fecha_de_registro?: string;
}

interface Dueno {
    id: number;
    nombre_completo: string;
}

const obtenerHistorial = async (): Promise<void> => {
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

        const datos: HistorialItem[] = await respuesta.json();
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

formLogin.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const matricula = (document.getElementById('matricula') as HTMLInputElement).value;
    const password = (document.getElementById('password-login') as HTMLInputElement).value;

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


(window as any).eliminarMascota = async (id: number) => {
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

const verificarEstado = (): void => {
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

const logout = (): void => {
    localStorage.removeItem('token_vet');
    verificarEstado();
};

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) btnLogout.onclick = logout;

formMascota.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token_vet');
    const nuevaMascota = {
        nombre: (document.getElementById('m-nombre') as HTMLInputElement).value,
        especie: (document.getElementById('m-especie') as HTMLInputElement).value,
        fecha_de_nacimiento: (document.getElementById('m-fecha') as HTMLInputElement).value,
        dueno_nombre_completo: (document.getElementById('m-dueno') as HTMLInputElement).value
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

const cargarDatalistDuenos = async (): Promise<void> => {
    const token = localStorage.getItem('token_vet');
    const datalist = document.getElementById('lista-duenos') as HTMLDataListElement;

    try {
        const res = await fetch('http://localhost:3000/duenos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const duenos: Dueno[] = await res.json();

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
const contenedor = document.getElementById('lista-historial');


const obtenerHistorial = async () => {
    const respuesta = await fetch('http://localhost:3000/historial');
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
};


window.eliminarMascota = async (id) => {
    window.eliminarMascota = async (id) => {
    const pass = prompt("Ingresá la clave de veterinario para borrar:");

    try {
        const respuesta = await fetch(`http://localhost:3000/mascotas/${id}`, {
            method: 'DELETE',
            headers: {
                // Aquí enviamos el token que el middleware espera
                'Authorization': pass 
            }
        });

        if (respuesta.ok) {
            alert('Registro eliminado');
            obtenerHistorial(); // Refrescamos la lista
        } else {
            const error = await respuesta.json();
            alert('Error: ' + error.error);
        }
    } catch (err) {
        console.error("Error en la conexión", err);
    }
};
};

obtenerHistorial();
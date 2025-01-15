document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calcularCostoBtn').addEventListener('click', calcularCosto);
    obtenerDatosUsuario(); // Llamada para obtener los datos del usuario logueado
});

let usuarioLogueado = {}; // Variable para almacenar los datos del usuario logueado

function obtenerDatosUsuario() {
    fetch('obtenerDatosUsuario.php') // Archivo PHP que retorna los datos del usuario logueado
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                usuarioLogueado = data.usuario;
            } else {
                alert('Error al obtener los datos del usuario');
            }
        })
        .catch(error => console.error('Error:', error));
}

function calcularCosto() {
    const camionId = document.getElementById('camiones').value;
    const peso = document.getElementById('peso').value;
    const distancia = directionsRenderers[selectedRouteIndex].directions.routes[selectedRouteIndex].legs[0].distance.value / 1000; // Convertir a kilómetros
    const duracion = directionsRenderers[selectedRouteIndex].directions.routes[selectedRouteIndex].legs[0].duration.text;
    let peajes = document.getElementById(`tolls-${selectedRouteIndex}`).textContent;

    // Limpiar y validar peajes
    peajes = peajes.replace(/[^0-9.-]+/g, ''); // Eliminar caracteres no numéricos
    peajes = parseFloat(peajes) || 0; // Convertir a número o establecer a 0 si es NaN

    fetch(`calcularCostoMapa.php?camionId=${camionId}&peso=${peso}&distancia=${distancia}&duracion=${duracion}&peajes=${peajes}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('costoTotal').innerHTML = `
                    <h3>Costo Total: $${data.costo}</h3>
                    <div class="button-group">
                        <button onclick="mantenerCotizacion(${data.costo})" class="button-maintain">Mantener Cotización</button>
                        <button onclick="confirmarCotizacion(${data.costo})" class="button-confirm">Confirmar Cotización</button>
                        <button onclick="cancelarCotizacion(${data.costo})" class="button-cancel">Cancelar Cotización</button>
                    </div>
                `;
            } else {
                alert('Error al calcular el costo');
            }
        })
        .catch(error => console.error('Error:', error));
}

function enviarDatosCotizacion(estatus, costo) {
    if (!usuarioLogueado || Object.keys(usuarioLogueado).length === 0) {
        alert('Error: No se pudieron obtener los datos del usuario logueado.');
        return;
    }

    const origen = document.getElementById('start').value;
    const destino = document.getElementById('end').value;
    const distancia = directionsRenderers[selectedRouteIndex].directions.routes[selectedRouteIndex].legs[0].distance.value / 1000;
    const duracion = directionsRenderers[selectedRouteIndex].directions.routes[selectedRouteIndex].legs[0].duration.text;
    const peajes = document.getElementById(`tolls-${selectedRouteIndex}`).textContent.replace(/[^0-9.-]+/g, '') || 0;
    const tipo_vehiculo = document.getElementById('camiones').options[document.getElementById('camiones').selectedIndex].text;
    const tipo_material = document.getElementById('tipo_material').options[document.getElementById('tipo_material').selectedIndex].text;
    const peso = document.getElementById('peso').value;
    const fecha_salida = document.getElementById('fechaSalida').value;
    const fecha_entrega = document.getElementById('fechaEntrega').value;

    fetch('guardarCotizacion.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...usuarioLogueado, // Usamos los datos del usuario logueado
            origen,
            destino,
            distancia,
            duracion,
            peajes,
            tipo_vehiculo,
            tipo_material,
            peso,
            fecha_salida,
            fecha_entrega,
            estatus,
            precio_total: costo
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            mostrarNotificacionFlotante(estatus); // Mostrar notificación
            setTimeout(() => {
                window.location.href = '../panelcliente/panelcliente.html'; // Ruta corregida
            }, 3000); // Esperar 3 segundos antes de redirigir
        } else {
            alert('Error al guardar la cotización');
        }
    })
    .catch(error => console.error('Error:', error));
}

function mostrarNotificacionFlotante(estatus) {
    let mensaje = '';
    switch (estatus) {
        case 'Pendiente':
            mensaje = 'Cotización pendiente.';
            break;
        case 'Confirmada':
            mensaje = 'Cotización confirmada.';
            break;
        case 'Cancelada':
            mensaje = 'Cotización cancelada.';
            break;
    }
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-flotante';
    notificacion.innerText = mensaje;
    document.body.appendChild(notificacion);
    setTimeout(() => {
        notificacion.remove();
    }, 2000); // Desaparece después de 2 segundos
}

function mantenerCotizacion(costo) {
    enviarDatosCotizacion('Pendiente', costo);
}

function confirmarCotizacion(costo) {
    enviarDatosCotizacion('Confirmada', costo);
}

function cancelarCotizacion(costo) {
    enviarDatosCotizacion('Cancelada', costo);
}

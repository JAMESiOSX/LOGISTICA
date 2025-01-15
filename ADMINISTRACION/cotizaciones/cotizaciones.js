document.addEventListener('DOMContentLoaded', function () {
    console.log("cotizaciones.js cargado y ejecutándose");

    const searchForm = document.getElementById('searchForm');
    const cotizacionesTable = document.getElementById('cotizacionesTable');

    // Cargar todos los registros al inicio
    fetch('cotizaciones.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Datos recibidos:", data);
        if (data.status === 'success') {
            displayCotizaciones(data.data);
        } else {
            showNotification('Error: ' + data.message, true);
        }
    })
    .catch(error => {
        console.error('Error en el fetch:', error);
        showNotification('Error en la solicitud', true);
    });

    if (searchForm.dataset.listenerAttached !== "true") {
        searchForm.dataset.listenerAttached = "true";

        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const search = document.getElementById('search').value;

            fetch(`cotizaciones.php?search=${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log("Datos recibidos:", data);
                if (data.status === 'success') {
                    displayCotizaciones(data.data);
                } else {
                    showNotification('Error: ' + data.message, true);
                }
            })
            .catch(error => {
                console.error('Error en el fetch:', error);
                showNotification('Error en la solicitud', true);
            });
        });
    }

    function displayCotizaciones(cotizaciones) {
        cotizacionesTable.innerHTML = '';
        cotizaciones.forEach(cotizacion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cotizacion.nombre_completo}</td>
                <td>${cotizacion.correo}</td>
                <td>${cotizacion.telefono}</td>
                <td>${cotizacion.origen}</td>
                <td>${cotizacion.destino}</td>
                <td>${cotizacion.peso}</td>
                <td>${cotizacion.tipo_mercancia}</td>
                <td>${cotizacion.fecha_salida}</td>
                <td>${cotizacion.fecha_entrega}</td>
                <td>${cotizacion.costo}</td>
                <td>${cotizacion.estatus}</td>
                <td>${cotizacion.fecha_creacion}</td>
                <td><button onclick="generatePDF(${cotizacion.id})">Generar PDF</button></td>
            `;
            cotizacionesTable.appendChild(row);
        });
    }
});

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#FF4C4C' : '#4CAF50';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function generatePDF(id) {
    fetch(`generarDocumento.php?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("PDF generado:", data);
        if (data.status === 'success') {
            showNotification('PDF generado correctamente.');
            window.location.href = 'generarDocumento.html';
        } else {
            showNotification('Error: ' + data.message, true);
        }
    })
    .catch(error => {
        console.error('Error en el fetch:', error);
        showNotification('Error en la solicitud', true);
    });
}

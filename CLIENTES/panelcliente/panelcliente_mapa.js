document.addEventListener("DOMContentLoaded", function () {
    function cargarCotizacionesMapaPendientes() {
        fetch('obtenerCotizacionesMapaPendientes.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const listaCotizaciones = document.getElementById('listaCotizacionesPendientes');
            if (!listaCotizaciones) {
                console.error("Elemento con id 'listaCotizacionesPendientes' no encontrado");
                return;
            }
            data.forEach(cotizacion => {
                const cotizacionDiv = document.createElement('div');
                cotizacionDiv.className = 'cotizacion';
                cotizacionDiv.innerHTML = `
                    <p><strong>Origen:</strong> ${cotizacion.origen}</p>
                    <p><strong>Destino:</strong> ${cotizacion.destino}</p>
                    <p><strong>Distancia:</strong> ${cotizacion.distancia} km</p>
                    <p><strong>Duración:</strong> ${cotizacion.duracion}</p>
                    <p><strong>Peajes:</strong> ${cotizacion.peajes} pesos</p>
                    <p><strong>Tipo de Vehículo:</strong> ${cotizacion.tipo_vehiculo}</p>
                    <p><strong>Material:</strong> ${cotizacion.tipo_material}</p>
                    <p><strong>Peso:</strong> ${cotizacion.peso} toneladas</p>
                    <p><strong>Fecha de Salida:</strong> ${new Date(cotizacion.fecha_salida).toLocaleString()}</p>
                    <p><strong>Fecha de Entrega:</strong> ${new Date(cotizacion.fecha_entrega).toLocaleString()}</p>
                    <p><strong>Precio Total:</strong> ${cotizacion.precio_total} pesos</p>
                    <button class="confirmarBtn">Confirmar</button>
                    <button class="rechazarBtn">Rechazar</button>
                `;
                listaCotizaciones.appendChild(cotizacionDiv);

                // Asignar funciones a los botones
                cotizacionDiv.querySelector('.confirmarBtn').onclick = () => actualizarEstatusCotizacionMapa(cotizacion.id, 'confirmado');
                cotizacionDiv.querySelector('.rechazarBtn').onclick = () => actualizarEstatusCotizacionMapa(cotizacion.id, 'rechazado');
            });
        })
        .catch(error => console.error('Error al cargar cotizaciones mapa pendientes:', error));
    }

    function cargarCotizacionesMapaConfirmadas() {
        fetch('obtenerCotizacionesMapaConfirmadas.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const tablaCotizacionesConfirmadas = document.getElementById('tablaCotizacionesConfirmadas').getElementsByTagName('tbody')[0];
            if (!tablaCotizacionesConfirmadas) {
                console.error("Elemento con id 'tablaCotizacionesConfirmadas' no encontrado");
                return;
            }
            data.forEach(cotizacion => {
                const row = tablaCotizacionesConfirmadas.insertRow();
                row.insertCell(0).textContent = `${cotizacion.origen} - ${cotizacion.destino}`;
                row.insertCell(1).textContent = cotizacion.tipo_vehiculo;
                row.insertCell(2).textContent = cotizacion.peso;
                row.insertCell(3).textContent = cotizacion.tipo_material;
                row.insertCell(4).textContent = new Date(cotizacion.fecha_salida).toLocaleString();
                row.insertCell(5).textContent = new Date(cotizacion.fecha_entrega).toLocaleString();
                row.insertCell(6).textContent = cotizacion.precio_total;

                const accionCell = row.insertCell(7);
                const generarDocumentoBtn = document.createElement('button');
                generarDocumentoBtn.textContent = 'Generar Documento';
                generarDocumentoBtn.onclick = () => generarDocumento(cotizacion.id);
                accionCell.appendChild(generarDocumentoBtn);
            });
        })
        .catch(error => console.error('Error al cargar cotizaciones mapa confirmadas:', error));
    }

    function actualizarEstatusCotizacionMapa(cotizacionId, estatus) {
        fetch('actualizarEstatusCotizacionMapa.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cotizacionId, estatus })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Estatus de la cotización actualizado exitosamente');
                cargarCotizacionesMapaPendientes(); // Recargar cotizaciones pendientes
                cargarCotizacionesMapaConfirmadas(); // Recargar cotizaciones confirmadas
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error al actualizar estatus de la cotización:', error));
    }

    function generarDocumento(cotizacionId) {
        window.location.href = `generarDocumentoMapa.php?cotizacionId=${cotizacionId}`;
    }

    cargarCotizacionesMapaPendientes();
    cargarCotizacionesMapaConfirmadas();
});

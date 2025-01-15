document.addEventListener("DOMContentLoaded", function () {
    function cargarCotizacionesConfirmadas() {
        fetch('obtenerCotizacionesConfirmadas.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const listaCotizaciones = document.getElementById('listaCotizacionesConfirmadas');
            if (!listaCotizaciones) {
                console.error("Elemento con id 'listaCotizacionesConfirmadas' no encontrado");
                return;
            }
            console.log("Elemento encontrado:", listaCotizaciones);
            listaCotizaciones.innerHTML = '';

            data.forEach(cotizacion => {
                const cotizacionRow = document.createElement('tr');
                cotizacionRow.innerHTML = `
                    <td>${cotizacion.ruta}</td>
                    <td>${cotizacion.nombre_camion}</td>
                    <td>${cotizacion.peso} toneladas</td>
                    <td>${cotizacion.tipo_material}</td>
                    <td>${cotizacion.precio_total} pesos</td>
                    <td>
                        <button onclick="generarDocumento(${cotizacion.id})">Generar Documento</button>
                    </td>
                `;
                listaCotizaciones.appendChild(cotizacionRow);
            });
        })
        .catch(error => console.error('Error al cargar cotizaciones confirmadas:', error));
    }

    cargarCotizacionesConfirmadas();
});

function generarDocumento(cotizacionId) {
    window.location.href = `generarDocumento.php?cotizacionId=${cotizacionId}`;
}

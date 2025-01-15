document.addEventListener("DOMContentLoaded", function () {
    const buscarBtn = document.getElementById('buscarBtn');
    const buscarNombre = document.getElementById('buscarNombre');

    // Función para cargar contratos
    function cargarContratos(nombre = '') {
        let url = 'contratos.php';
        if (nombre) {
            url += `?nombre=${encodeURIComponent(nombre)}`;
        }
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const tablaContratos = document.getElementById('tablaContratos').getElementsByTagName('tbody')[0];
            tablaContratos.innerHTML = ''; // Limpiar la tabla

            if (Array.isArray(data)) {
                data.forEach(contrato => {
                    const row = tablaContratos.insertRow();
                    row.insertCell(0).textContent = contrato.nuevo_id; // Mostrar el nuevo ID secuencial
                    row.insertCell(1).textContent = contrato.nombre;
                    row.insertCell(2).textContent = contrato.apellidos;
                    row.insertCell(3).textContent = contrato.ruta; // Mostrar ruta u origen según corresponda
                    row.insertCell(4).textContent = new Date(contrato.fecha_creacion).toLocaleString();

                    const accionCell = row.insertCell(5);
                    const generarPdfBtn = document.createElement('button');
                    generarPdfBtn.textContent = 'Generar PDF';

                    // Verificar la fuente del contrato
                    if (contrato.source === 'contratos_clientes_maps') {
                        generarPdfBtn.onclick = () => {
                            window.location.href = `generarDocumentoMapa.php?cotizacionId=${contrato.id}`;
                        };
                    } else {
                        generarPdfBtn.onclick = () => {
                            window.location.href = `generarDocumento.php?contratoId=${contrato.id}`;
                        };
                    }

                    accionCell.appendChild(generarPdfBtn);
                });
            } else {
                console.error('La respuesta no es una matriz:', data);
            }
        })
        .catch(error => console.error('Error al cargar contratos:', error));
    }

    // Evento para buscar contratos
    buscarBtn.addEventListener('click', () => {
        const nombre = buscarNombre.value.trim();
        cargarContratos(nombre);
    });

    // Cargar contratos al cargar la página
    cargarContratos();
});

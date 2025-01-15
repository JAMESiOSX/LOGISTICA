document.addEventListener('DOMContentLoaded', function() {
    fetch('../panelcliente/obtenerDatos.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Agregar mensaje de depuración
            if (data.status === 'success') {
                console.log('Datos de camiones:', data.camiones); // Verificar datos de camiones
                console.log('Datos de materiales:', data.materiales); // Verificar datos de materiales
                
                // Llenar el selector de camiones
                const camionesSelect = document.getElementById('camiones');
                data.camiones.forEach(camion => {
                    const option = document.createElement('option');
                    option.value = camion.id;
                    option.textContent = camion.tipo_transporte;
                    camionesSelect.appendChild(option);
                });

                // Llenar el selector de tipo de material
                const tipoMaterialSelect = document.getElementById('tipo_material');
                data.materiales.forEach(material => {
                    const option = document.createElement('option');
                    option.value = material.id_material;
                    option.textContent = material.nombre_material;
                    tipoMaterialSelect.appendChild(option);
                });

            } else {
                console.error('Error al obtener los datos:', data.message);
            }
        })
        .catch(error => console.error('Error al obtener los datos:', error));
});

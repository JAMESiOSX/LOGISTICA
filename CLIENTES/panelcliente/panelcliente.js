document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");
    const perfilInfo = document.getElementById("perfil-info");
    const updateProfileBtn = document.getElementById("updateProfileBtn");
    const updateModal = document.getElementById("updateModal");
    const closeBtn = document.querySelector(".closeBtn");
    const updateProfileForm = document.getElementById("updateProfileForm");

    // Función para cargar datos de perfil del usuario
    function cargarPerfil() {
        fetch('panelcliente.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const user = data.user;
                perfilInfo.innerHTML = `
                    <p><strong>Nombre:</strong> ${user.nombre}</p>
                    <p><strong>Apellidos:</strong> ${user.apellidos}</p>
                    <p><strong>Correo:</strong> ${user.correo}</p>
                    <p><strong>RFC:</strong> ${user.rfc}</p>
                    <p><strong>CURP:</strong> ${user.curp}</p>
                    <p><strong>Teléfono:</strong> ${user.telefono}</p>
                    <p><strong>Dirección:</strong> ${user.direccion}</p>
                    <p><strong>Nombre Empresa:</strong> ${user.nombre_empresa}</p>
                `;
                // Rellenar el formulario del modal con los datos del usuario
                document.getElementById('nombre').value = user.nombre;
                document.getElementById('apellidos').value = user.apellidos;
                document.getElementById('correo').value = user.correo;
                document.getElementById('rfc').value = user.rfc;
                document.getElementById('curp').value = user.curp;
                document.getElementById('telefono').value = user.telefono;
                document.getElementById('direccion').value = user.direccion;
                document.getElementById('nombre_empresa').value = user.nombre_empresa;
            } else {
                perfilInfo.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            perfilInfo.innerHTML = '<p>Hubo un problema al cargar los datos del perfil.</p>';
        });
    }

    // Función para cargar las rutas, camiones y materiales disponibles
    function cargarDatos() {
        fetch('obtenerDatos.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const rutasSelect = document.getElementById('rutas');
            const camionesSelect = document.getElementById('camiones');
            const tipoMaterialSelect = document.getElementById('tipo_material');

            data.rutas.forEach(ruta => {
                const option = document.createElement('option');
                option.value = ruta.id;
                option.textContent = `${ruta.origen} - ${ruta.destino}`;
                rutasSelect.appendChild(option);
            });

            data.camiones.forEach(camion => {
                const option = document.createElement('option');
                option.value = camion.id;
                option.textContent = `${camion.tipo_transporte} - ${camion.capacidad_carga} toneladas`;
                camionesSelect.appendChild(option);
            });

            data.materiales.forEach(material => {
                const option = document.createElement('option');
                option.value = material.id_material;
                option.textContent = material.nombre_material;
                tipoMaterialSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar datos:', error));
    }

    // Función para calcular el costo del transporte
    function calcularCosto() {
        const rutaId = document.getElementById('rutas').value;
        const camionId = document.getElementById('camiones').value;
        const peso = document.getElementById('peso').value;
        const pesoToneladas = peso / 1000; // Convertir a toneladas

        if (!rutaId || !camionId || !peso || !document.getElementById('tipo_material').value) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        fetch(`calcularCosto.php?rutaId=${rutaId}&camionId=${camionId}&peso=${pesoToneladas}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const costo = data.costo;
                document.getElementById('costoTotal').textContent = `El total de su viaje sería: ${costo} pesos`;
                document.getElementById('accionesCotizacion').style.display = 'block';
                setupAccionesCotizacion(rutaId, camionId, pesoToneladas, document.getElementById('tipo_material').value, costo);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error al calcular el costo:', error));
    }

    // Función para manejar las acciones de cotización
    function setupAccionesCotizacion(rutaId, camionId, peso, tipoMaterial, costo) {
        const confirmarBtn = document.getElementById('confirmarCotizacionBtn');
        const mantenerBtn = document.getElementById('mantenerCotizacionBtn');
        const rechazarBtn = document.getElementById('rechazarCotizacionBtn');

        confirmarBtn.onclick = () => manejarCotizacion('confirmar', rutaId, camionId, peso, tipoMaterial, costo);
        mantenerBtn.onclick = () => manejarCotizacion('mantener', rutaId, camionId, peso, tipoMaterial, costo);
        rechazarBtn.onclick = () => manejarCotizacion('rechazar', rutaId, camionId, peso, tipoMaterial, costo);
    }

    // Función para manejar las acciones de cotización
    function manejarCotizacion(accion, rutaId, camionId, peso, tipoMaterial, costo) {
        const user = getUserDetails();
        const estatus = accion === 'confirmar' ? 'confirmado' : 'pendiente';
        const fechaSalida = document.getElementById('fechaSalida').value;
        const fechaEntrega = document.getElementById('fechaEntrega').value;

        if (accion === 'rechazar') {
            document.getElementById('costoTotal').textContent = '';
            document.getElementById('accionesCotizacion').style.display = 'none';
            return;
        }

        const data = {
            nombre: user.nombre,
            apellidos: user.apellidos,
            telefono: user.telefono,
            rfc: user.rfc,
            correo: user.correo,
            nombre_empresa: user.nombre_empresa,
            rutaId: rutaId,
            camionId: camionId,
            peso: peso,
            tipo_material: tipoMaterial,
            precio_total: costo,
            estatus: estatus,
            fecha_salida: fechaSalida,
            fecha_entrega: fechaEntrega
        };

        fetch('manejarCotizacion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Cotización manejada exitosamente');
                cargarCotizacionesPendientes(); // Recargar cotizaciones pendientes
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error al manejar cotización:', error));
    }

    // Función para obtener los detalles del usuario
    function getUserDetails() {
        return {
            nombre: document.getElementById('nombre').value,
            apellidos: document.getElementById('apellidos').value,
            telefono: document.getElementById('telefono').value,
            rfc: document.getElementById('rfc').value,
            correo: document.getElementById('correo').value,
            nombre_empresa: document.getElementById('nombre_empresa').value
        };
    }

    // Función para cargar cotizaciones pendientes
    function cargarCotizacionesPendientes() {
        fetch('obtenerCotizacionesPendientes.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const listaCotizaciones = document.getElementById('listaCotizacionesPendientes');
            listaCotizaciones.innerHTML = '';

            data.forEach(cotizacion => {
                const cotizacionDiv = document.createElement('div');
                cotizacionDiv.className = 'cotizacion';
                cotizacionDiv.innerHTML = `
                    <p><strong>Ruta:</strong> ${cotizacion.ruta}</p>
                    <p><strong>Camión:</strong> ${cotizacion.nombre_camion}</p>
                    <p><strong>Peso:</strong> ${cotizacion.peso} toneladas</p>
                    <p><strong>Material:</strong> ${cotizacion.tipo_material}</p>
                    <p><strong>Fecha de Salida:</strong> ${new Date(cotizacion.fecha_salida).toLocaleString()}</p>
                    <p><strong>Fecha de Entrega:</strong> ${new Date(cotizacion.fecha_entrega).toLocaleString()}</p>
                    <p><strong>Precio Total:</strong> ${cotizacion.precio_total} pesos</p>
                    <button type="button" class="confirmarBtn">Confirmar</button>
                    <button type="button" class="rechazarBtn">Rechazar</button>
                `;
                
                const confirmarBtn = cotizacionDiv.querySelector('.confirmarBtn');
                const rechazarBtn = cotizacionDiv.querySelector('.rechazarBtn');

                confirmarBtn.onclick = () => actualizarEstatusCotizacion(cotizacion.id, 'confirmado');
                rechazarBtn.onclick = () => actualizarEstatusCotizacion(cotizacion.id, 'rechazado');

                listaCotizaciones.appendChild(cotizacionDiv);
            });
        })
        .catch(error => console.error('Error al cargar cotizaciones pendientes:', error));
    }

    // Función para cargar cotizaciones confirmadas
    function cargarCotizacionesConfirmadas() {
        fetch('obtenerCotizacionesConfirmadas.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const tablaCotizacionesConfirmadas = document.getElementById('tablaCotizacionesConfirmadas').getElementsByTagName('tbody')[0];
            tablaCotizacionesConfirmadas.innerHTML = ''; // Limpiar la tabla

            data.forEach(cotizacion => {
                const row = tablaCotizacionesConfirmadas.insertRow();
                row.insertCell(0).textContent = cotizacion.ruta;
                row.insertCell(1).textContent = cotizacion.nombre_camion;
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
        .catch(error => console.error('Error al cargar cotizaciones confirmadas:', error));
    }

    // Función para generar el documento
    function generarDocumento(cotizacionId) {
        window.location.href = `generarDocumento.php?cotizacionId=${cotizacionId}`;
    }

    // Función para actualizar el estatus de una cotización
    function actualizarEstatusCotizacion(cotizacionId, estatus) {
        fetch('actualizarCotizacion.php', {
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
                cargarCotizacionesPendientes(); // Recargar cotizaciones pendientes
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error al actualizar estatus de la cotización:', error));
    }

    // Inicializar las funcionalidades al cargar la página
    cargarPerfil();
    cargarDatos();
    cargarCotizacionesPendientes();
    cargarCotizacionesConfirmadas();

    // Abrir el modal al hacer clic en el botón de actualizar
    updateProfileBtn.addEventListener("click", function () {
        updateModal.style.display = "block";
    });

    // Cerrar el modal al hacer clic en el botón de cerrar
    closeBtn.addEventListener("click", function () {
        updateModal.style.display = "none";
    });

    // Cerrar el modal al hacer clic fuera del contenido del modal
    window.addEventListener("click", function (event) {
        if (event.target === updateModal) {
            updateModal.style.display = "none";
        }
    });

    // Enviar el formulario de actualización
    updateProfileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(updateProfileForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('updateProfile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Perfil actualizado exitosamente');
                updateModal.style.display = "none";
                cargarPerfil(); // Recargar los datos del perfil actualizados
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al actualizar el perfil.');
        });
    });

    // Calcular el costo del transporte
    document.getElementById('calcularCostoBtn').addEventListener('click', calcularCosto);

    // Función para cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "../logout.php"; // Redirigir a la página de logout
        });
    }
});

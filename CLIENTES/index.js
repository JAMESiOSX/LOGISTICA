document.addEventListener('DOMContentLoaded', function () {
    const authBtn = document.getElementById('authBtn');
    const modalAuth = document.getElementById('modalAuth');
    const loginModal = document.getElementById('loginForm');
    const registerModal = document.getElementById('registerForm');
    const cotizacionIcon = document.getElementById('cotizacionIcon');
    const cotizacionModal = document.getElementById('modalCotizacion');
    const closeBtns = document.querySelectorAll('.closeBtn');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const confirmarBtn = document.getElementById('confirmarCotizacionBtn');
    const rechazarBtn = document.getElementById('rechazarCotizacionBtn');

    if (authBtn) {
        authBtn.addEventListener('click', () => {
            modalAuth.style.display = 'block';
            loginModal.style.display = 'block';
            registerModal.style.display = 'none';
        });
    }

    if (showRegister) {
        showRegister.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', () => {
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }

    closeBtns.forEach(btn => btn.addEventListener('click', function () {
        this.parentElement.parentElement.style.display = 'none';
    }));

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Mostrar el modal de cotización rápida al hacer clic en el icono
    if (cotizacionIcon) {
        cotizacionIcon.addEventListener('click', () => {
            cotizacionModal.style.display = 'block';
            cargarDatos();
        });
    }

    // Función para cargar datos de rutas, camiones y materiales
    function cargarDatos() {
        fetch('panelcliente/obtenerDatos.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const rutasSelect = document.getElementById('rutas');
            const camionesSelect = document.getElementById('camiones');
            const tipoMaterialSelect = document.getElementById('tipoMaterial');

            rutasSelect.innerHTML = '';
            camionesSelect.innerHTML = '';
            tipoMaterialSelect.innerHTML = '';

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

    // Manejar el formulario de cotización rápida
    document.getElementById('cotizacionForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const nombreCompleto = document.getElementById('nombreCompleto').value;
        const correo = document.getElementById('correoCotizacion').value;
        const telefono = document.getElementById('telefonoCotizacion').value;
        const rutaId = document.getElementById('rutas').value;
        const camionId = document.getElementById('camiones').value;
        const peso = document.getElementById('peso').value;
        const tipoMaterial = document.getElementById('tipoMaterial').value;
        const fechaSalida = document.getElementById('fechaSalida').value;
        const fechaEntrega = document.getElementById('fechaEntrega').value;

        console.log('Datos del formulario:', {
            nombreCompleto,
            correo,
            telefono,
            rutaId,
            camionId,
            peso,
            tipoMaterial,
            fechaSalida,
            fechaEntrega
        });

        fetch(`panelcliente/calcularCosto.php?rutaId=${rutaId}&camionId=${camionId}&peso=${peso}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const costo = data.costo;
                document.getElementById('cotizacionResultado').textContent = `El total de su viaje sería: ${costo} pesos`;
                document.getElementById('accionesCotizacion').style.display = 'block';

                confirmarBtn.onclick = () => manejarCotizacion('confirmar', nombreCompleto, correo, telefono, rutaId, camionId, peso, tipoMaterial, fechaSalida, fechaEntrega, costo);
                rechazarBtn.onclick = () => manejarCotizacion('rechazar');
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error al calcular el costo:', error));
    });

    // Función para manejar la cotización
    function manejarCotizacion(accion, nombreCompleto, correo, telefono, rutaId, camionId, peso, tipoMaterial, fechaSalida, fechaEntrega, costo) {
        if (accion === 'rechazar') {
            document.getElementById('cotizacionResultado').textContent = 'Cotización cancelada.';
            document.getElementById('accionesCotizacion').style.display = 'none';
            return;
        }

        const data = {
            nombre_completo: nombreCompleto,
            correo: correo,
            telefono: telefono,
            rutaId: rutaId,
            camionId: camionId,
            peso: peso,
            tipo_material: tipoMaterial,
            fecha_salida: fechaSalida,
            fecha_entrega: fechaEntrega,
            costo: costo,
            estatus: 'confirmado'
        };

        console.log('Datos a enviar:', data);

        fetch('cotizacionRapida.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            if (data.status === 'success') {
                document.getElementById('cotizacionResultado').textContent = 'Gracias por su confirmación, nos pondremos en contacto con usted.';
                document.getElementById('accionesCotizacion').style.display = 'none';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error al manejar la cotización:', error);
            alert('Error al manejar la cotización: ' + error.message);
        });
    }
});

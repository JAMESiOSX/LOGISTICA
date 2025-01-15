document.addEventListener("DOMContentLoaded", function () {
    const btnConsultar = document.getElementById("btnConsultar");
    const camionesTableBody = document.getElementById("camionesBody");
    const modalAgregar = document.getElementById("modalAgregar");
    const modalActualizar = document.getElementById("modalActualizar");
    const btnAgregarNuevo = document.getElementById("btnAgregarNuevo");
    const btnCerrarModalAgregar = document.getElementById("cerrarModal");
    const btnCerrarModalActualizar = document.getElementById("cerrarModalUpd");
    const nombreCamionInput = document.getElementById("nombre_camion");

    // Consultar camiones
    if (btnConsultar) {
        btnConsultar.addEventListener("click", function () {
            const nombreCamion = nombreCamionInput.value.trim();
            let queryUrl = '../camiones/camiones.php';
            if (nombreCamion) {
                queryUrl += `?nombre=${encodeURIComponent(nombreCamion)}`;
            }

            fetch(queryUrl, { method: 'GET' })
                .then((response) => response.json())
                .then((data) => {
                    camionesTableBody.innerHTML = ''; // Limpiar tabla
                    data.forEach((camion) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${camion.id}</td>
                            <td>${camion.tipo_transporte}</td>
                            <td>${camion.tipo_vehiculo}</td>
                            <td>${camion.placas_transporte}</td>
                            <td>${camion.numero_economico}</td>
                            <td>${camion.modelo_vehiculo}</td>
                            <td>${camion.configuracion_vehicular}</td>
                            <td>${camion.tipo_permiso_sct}</td>
                            <td>${camion.numero_permiso_sct}</td>
                            <td>${camion.nombre_aseguradora}</td>
                            <td>${camion.numero_poliza}</td>
                            <td>${camion.rendimiento}</td>
                            <td>${camion.capacidad_carga}</td>
                            <td>
                                <button class="btnUpdate" data-id="${camion.id}">Actualizar</button>
                                <button class="btnDelete" data-id="${camion.id}">Eliminar</button>
                            </td>
                        `;
                        camionesTableBody.appendChild(row);
                    });

                    // Asignar eventos a los botones dinámicos
                    document.querySelectorAll('.btnUpdate').forEach((btn) => {
                        btn.addEventListener('click', function () {
                            const id = this.dataset.id;
                            openModalActualizar(id);
                        });
                    });

                    document.querySelectorAll('.btnDelete').forEach((btn) => {
                        btn.addEventListener('click', function () {
                            const id = this.dataset.id;
                            deleteCamion(id);
                        });
                    });
                });
        });
    }

    // Abrir modal para agregar nuevo camión
    if (btnAgregarNuevo) {
        btnAgregarNuevo.addEventListener("click", function () {
            modalAgregar.style.display = "flex"; // Cambiar a 'flex' para centrar
        });
    }

    // Cerrar modal de agregar
    if (btnCerrarModalAgregar) {
        btnCerrarModalAgregar.addEventListener("click", function () {
            modalAgregar.style.display = "none";
        });
    }

    // Cerrar modal de actualizar
    if (btnCerrarModalActualizar) {
        btnCerrarModalActualizar.addEventListener("click", function () {
            modalActualizar.style.display = "none";
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function (event) {
        if (event.target === modalAgregar) {
            modalAgregar.style.display = "none";
        }
        if (event.target === modalActualizar) {
            modalActualizar.style.display = "none";
        }
    });

    // Función para abrir modal de actualización
    function openModalActualizar(id) {
        fetch(`../camiones/camiones.php?id=${id}`, { method: 'GET' })
            .then(response => response.json())
            .then((data) => {
                const camion = data[0]; // Suponiendo que solo regresa un camión
                document.getElementById("tipo_transporte_upd").value = camion.tipo_transporte;
                document.getElementById("tipo_vehiculo_upd").value = camion.tipo_vehiculo;
                document.getElementById("placas_upd").value = camion.placas_transporte;
                document.getElementById("economico_upd").value = camion.numero_economico;
                document.getElementById("modelo_upd").value = camion.modelo_vehiculo;
                document.getElementById("configuracion_upd").value = camion.configuracion_vehicular;
                document.getElementById("permiso_sct_upd").value = camion.tipo_permiso_sct;
                document.getElementById("num_permiso_upd").value = camion.numero_permiso_sct;
                document.getElementById("aseguradora_upd").value = camion.nombre_aseguradora;
                document.getElementById("num_poliza_upd").value = camion.numero_poliza;
                document.getElementById("rendimiento_upd").value = camion.rendimiento;
                document.getElementById("capacidad_carga_upd").value = camion.capacidad_carga;
                document.getElementById("camion_id_upd").value = camion.id; // Asegúrate de que el ID se establece en un campo oculto del formulario
                modalActualizar.style.display = "flex"; // Cambiar a 'flex' para centrar
            });
    }

    // Función para agregar un nuevo camión
    document.getElementById("formAgregarCamion").addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(this);
        const entries = Object.fromEntries(data.entries());

        // Validación de campos
        if (!entries.modelo_vehiculo || isNaN(entries.modelo_vehiculo)) {
            alert("El campo 'Modelo' es obligatorio y debe ser un número.");
            return;
        }

        fetch('../camiones/camiones.php', {
            method: 'POST',
            body: JSON.stringify(entries),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    alert("Camión agregado exitosamente");
                } else {
                    alert("Error al agregar el camión: " + data.message);
                }
                modalAgregar.style.display = "none";
                btnConsultar.click();
            });
    });

    // Función para actualizar un camión
    document.getElementById("formActualizarCamion").addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(this);
        // Agregar el ID del camión al FormData
        data.append('id', document.getElementById("camion_id_upd").value);
        const entries = Object.fromEntries(data.entries());

        // Validación de campos
        if (!entries.modelo_vehiculo || isNaN(entries.modelo_vehiculo)) {
            alert("El campo 'Modelo' es obligatorio y debe ser un número.");
            return;
        }

        fetch('../camiones/camiones.php', {
            method: 'PUT',
            body: JSON.stringify(entries),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    alert("Camión actualizado exitosamente");
                } else {
                    alert("Error al actualizar el camión: " + data.message);
                }
                modalActualizar.style.display = "none";
                btnConsultar.click();
            });
    });

    // Función para eliminar un camión con confirmación
    function deleteCamion(id) {
        if (confirm("¿Estás seguro de que deseas eliminar este camión?")) {
            fetch(`../camiones/camiones.php?id=${id}`, {
                method: 'DELETE',
                body: JSON.stringify({ id: id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.status === 'success') {
                        alert("Camión eliminado exitosamente");
                    } else {
                        alert("Error al eliminar el camión: " + data.message);
                    }
                    btnConsultar.click();
                });
        }
    }
});

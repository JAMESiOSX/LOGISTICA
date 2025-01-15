document.addEventListener("DOMContentLoaded", function () {
    const btnConsultar = document.getElementById("btnConsultar");
    const choferesTableBody = document.getElementById("choferesBody");
    const modalAgregar = document.getElementById("modalAgregar");
    const modalActualizar = document.getElementById("modalActualizar");
    const btnAgregarNuevo = document.getElementById("btnAgregarNuevo");
    const btnCerrarModalAgregar = document.getElementById("cerrarModal");
    const btnCerrarModalActualizar = document.getElementById("cerrarModalUpd");
    const nombreChoferInput = document.getElementById("nombre_chofer");

    // Consultar choferes
    if (btnConsultar) {
        btnConsultar.addEventListener("click", function () {
            const nombreChofer = nombreChoferInput.value.trim();
            let queryUrl = '../choferes/choferes.php';
            if (nombreChofer) {
                queryUrl += `?nombre=${encodeURIComponent(nombreChofer)}`;
            }

            fetch(queryUrl, { method: 'GET' })
                .then((response) => response.json())
                .then((data) => {
                    choferesTableBody.innerHTML = ''; // Limpiar tabla
                    data.forEach((chofer) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${chofer.id}</td>
                            <td>${chofer.rfc}</td>
                            <td>${chofer.nombre_completo}</td>
                            <td>${chofer.numero_licencia}</td>
                            <td>${chofer.numero_seguridad_social}</td>
                            <td>${chofer.numero_telefono}</td>
                            <td>
                                <button class="btnUpdate" data-id="${chofer.id}">Actualizar</button>
                                <button class="btnDelete" data-id="${chofer.id}">Eliminar</button>
                            </td>
                        `;
                        choferesTableBody.appendChild(row);
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
                            deleteChofer(id);
                        });
                    });
                });
        });
    }

    // Abrir modal para agregar nuevo chofer
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
        fetch(`../choferes/choferes.php?id=${id}`, { method: 'GET' })
            .then(response => response.json())
            .then((data) => {
                const chofer = data[0]; // Suponiendo que solo regresa un chofer
                document.getElementById("rfc_upd").value = chofer.rfc;
                document.getElementById("nombre_completo_upd").value = chofer.nombre_completo;
                document.getElementById("numero_licencia_upd").value = chofer.numero_licencia;
                document.getElementById("numero_seguridad_social_upd").value = chofer.numero_seguridad_social;
                document.getElementById("numero_telefono_upd").value = chofer.numero_telefono;
                document.getElementById("chofer_id_upd").value = chofer.id; // Asegúrate de que el ID se establece en un campo oculto del formulario
                modalActualizar.style.display = "flex"; // Cambiar a 'flex' para centrar
            });
    }

    // Función para agregar un nuevo chofer
    document.getElementById("formAgregarChofer").addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(this);
        const entries = Object.fromEntries(data.entries());

        fetch('../choferes/choferes.php', {
            method: 'POST',
            body: JSON.stringify(entries),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    alert("Chofer agregado exitosamente");
                } else {
                    alert("Error al agregar el chofer: " + data.message);
                }
                modalAgregar.style.display = "none";
                btnConsultar.click();
            });
    });

    // Función para actualizar un chofer
    document.getElementById("formActualizarChofer").addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(this);
        // Agregar el ID del chofer al FormData
        data.append('id', document.getElementById("chofer_id_upd").value);
        const entries = Object.fromEntries(data.entries());

        fetch('../choferes/choferes.php', {
            method: 'PUT',
            body: JSON.stringify(entries),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    alert("Chofer actualizado exitosamente");
                } else {
                    alert("Error al actualizar el chofer: " + data.message);
                }
                modalActualizar.style.display = "none";
                btnConsultar.click();
            });
    });

    // Función para eliminar un chofer con confirmación
    function deleteChofer(id) {
        if (confirm("¿Estás seguro de que deseas eliminar este chofer?")) {
            fetch(`../choferes/choferes.php?id=${id}`, {
                method: 'DELETE',
                body: JSON.stringify({ id: id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.status === 'success') {
                        alert("Chofer eliminado exitosamente");
                    } else {
                        alert("Error al eliminar el chofer: " + data.message);
                    }
                    btnConsultar.click();
                });
        }
    }
});

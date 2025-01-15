document.addEventListener("DOMContentLoaded", function () {
    const btnConsultar = document.getElementById("btnConsultar");
    const clientesTableBody = document.getElementById("clientesBody");
    const modalAgregar = document.getElementById("modalAgregar");
    const modalActualizar = document.getElementById("modalActualizar");
    const btnAgregarNuevo = document.getElementById("btnAgregarNuevo");
    const btnCerrarModalAgregar = document.getElementById("cerrarModal");
    const btnCerrarModalActualizar = document.getElementById("cerrarModalUpd");
    const nombreClienteInput = document.getElementById("nombre_cliente");

    // Consultar clientes
    if (btnConsultar) {
        btnConsultar.addEventListener("click", function () {
            const nombreCliente = nombreClienteInput.value.trim();
            let queryUrl = '../clientes/clientes.php';
            if (nombreCliente) {
                queryUrl += `?nombre=${encodeURIComponent(nombreCliente)}`;
            }

            fetch(queryUrl, { method: 'GET' })
                .then((response) => response.json())
                .then((data) => {
                    clientesTableBody.innerHTML = ''; // Limpiar tabla
                    data.forEach((cliente) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${cliente.id}</td>
                            <td>${cliente.nombre}</td>
                            <td>${cliente.apellidos}</td>
                            <td>${cliente.correo}</td>
                            <td>${cliente.rfc}</td>
                            <td>${cliente.curp}</td>
                            <td>${cliente.telefono}</td>
                            <td>${cliente.direccion}</td>
                            <td>${cliente.nombre_empresa}</td>
                            <td>
                                <button class="btnUpdate" data-id="${cliente.id}">Actualizar</button>
                                <button class="btnDelete" data-id="${cliente.id}">Eliminar</button>
                            </td>
                        `;
                        clientesTableBody.appendChild(row);
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
                            deleteCliente(id);
                        });
                    });
                });
        });
    }

    // Abrir modal para agregar nuevo cliente
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
        fetch(`../clientes/clientes.php?id=${id}`, { method: 'GET' })
            .then(response => response.json())
            .then((data) => {
                const cliente = data[0]; // Suponiendo que solo regresa un cliente
                document.getElementById("nombre_upd").value = cliente.nombre;
                document.getElementById("apellidos_upd").value = cliente.apellidos;
                document.getElementById("correo_upd").value = cliente.correo;
                document.getElementById("rfc_upd").value = cliente.rfc;
                document.getElementById("curp_upd").value = cliente.curp;
                document.getElementById("telefono_upd").value = cliente.telefono;
                document.getElementById("direccion_upd").value = cliente.direccion;
                document.getElementById("nombre_empresa_upd").value = cliente.nombre_empresa;
                document.getElementById("cliente_id_upd").value = cliente.id; // Asegúrate de que el ID se establece en un campo oculto del formulario
                modalActualizar.style.display = "flex"; // Cambiar a 'flex' para centrar
            });
    }

    // Función para agregar un nuevo cliente
    document.getElementById("formAgregarCliente").addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(this);
        const entries = Object.fromEntries(data.entries());

        fetch('../clientes/clientes.php', {
            method: 'POST',
            body: JSON.stringify(entries),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    alert("Cliente agregado exitosamente");
                } else {
                    alert("Error al agregar el cliente: " + data.message);
                }
                modalAgregar.style.display = "none";
                btnConsultar.click();
            });
    });

    // Función para actualizar un cliente
    document.getElementById("formActualizarCliente").addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(this);
        // Agregar el ID del cliente al FormData
        data.append('id', document.getElementById("cliente_id_upd").value);
        const entries = Object.fromEntries(data.entries());

        fetch('../clientes/clientes.php', {
            method: 'PUT',
            body: JSON.stringify(entries),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    alert("Cliente actualizado exitosamente");
                } else {
                    alert("Error al actualizar el cliente: " + data.message);
                }
                modalActualizar.style.display = "none";
                btnConsultar.click();
            });
    });

    // Función para eliminar un cliente con confirmación
    function deleteCliente(id) {
        if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            fetch(`../clientes/clientes.php?id=${id}`, {
                method: 'DELETE',
                body: JSON.stringify({ id: id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.status === 'success') {
                        alert("Cliente eliminado exitosamente");
                    } else {
                        alert("Error al eliminar el cliente: " + data.message);
                    }
                    btnConsultar.click();
                });
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const btnConsultar = document.getElementById("btnConsultar");
    const rutasTableBody = document.getElementById("rutasBody");
    const modalAgregar = document.getElementById("modalAgregar");
    const modalActualizar = document.getElementById("modalActualizar");
    const btnAgregarNuevo = document.getElementById("btnAgregarNuevo");
    const btnCerrarModalAgregar = document.getElementById("cerrarModal");
    const btnCerrarModalActualizar = document.getElementById("cerrarModalUpd");
    const nombreRutaInput = document.getElementById("nombre_ruta");
    const numeroCasetasInput = document.getElementById("numero_casetas");
    const casetasContainer = document.getElementById("casetasContainer");
    const numeroCasetasInputUpd = document.getElementById("numero_casetas_upd");
    const casetasContainerUpd = document.getElementById("casetasContainerUpd");

    // Consultar rutas
    if (btnConsultar) {
        btnConsultar.addEventListener("click", function () {
            const nombreRuta = nombreRutaInput.value.trim();
            let queryUrl = '../rutas/rutas.php';
            if (nombreRuta) {
                queryUrl += `?nombre=${encodeURIComponent(nombreRuta)}`;
            }

            fetch(queryUrl, { method: 'GET' })
                .then((response) => response.json())
                .then((data) => {
                    rutasTableBody.innerHTML = ''; // Limpiar tabla
                    data.forEach((ruta) => {
                        const totalCostoCasetas = ruta.costo_caseta.split(', ').reduce((total, costo) => total + parseFloat(costo), 0);

                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${ruta.id}</td>
                            <td>${ruta.origen}</td>
                            <td>${ruta.destino}</td>
                            <td>${ruta.distancia}</td>
                            <td>${ruta.numero_casetas}</td>
                            <td>${ruta.nombre_caseta}</td>
                            <td>${ruta.costo_caseta}</td>
                            <td>${ruta.tiempo_aproximado}</td>
                            <td>${ruta.fecha_ruta}</td>
                            <td>${totalCostoCasetas}</td>
                            <td>
                                <button class="btnUpdate" data-id="${ruta.id}">Actualizar</button>
                                <button class="btnDelete" data-id="${ruta.id}">Eliminar</button>
                            </td>
                        `;
                        rutasTableBody.appendChild(row);
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
                            deleteRuta(id);
                        });
                    });
                });
        });
    }

    // Abrir modal para agregar nueva ruta
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
        fetch(`../rutas/rutas.php?id=${id}`, { method: 'GET' })
            .then(response => response.json())
            .then((data) => {
                const ruta = data[0]; // Suponiendo que solo regresa una ruta
                document.getElementById("origen_upd").value = ruta.origen;
                document.getElementById("destino_upd").value = ruta.destino;
                document.getElementById("distancia_upd").value = ruta.distancia;
                document.getElementById("numero_casetas_upd").value = ruta.numero_casetas;
                generateCasetasFields(ruta.numero_casetas, casetasContainerUpd, ruta.nombre_caseta, ruta.costo_caseta);
                document.getElementById("tiempo_aproximado_upd").value = ruta.tiempo_aproximado;
                document.getElementById("fecha_ruta_upd").value = ruta.fecha_ruta;
                document.getElementById("ruta_id_upd").value = ruta.id; // Asegúrate de que el ID se establece en un campo oculto del formulario
                modalActualizar.style.display = "flex"; // Cambiar a 'flex' para centrar
            });
    }

    // Función para agregar una nueva ruta
    document.getElementById("formAgregarRuta").addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(this);
        const entries = Object.fromEntries(data.entries());

        // Concatenar nombres y costos de casetas
        const numeroCasetas = entries.numero_casetas;
        const nombresCasetas = [];
        const costosCasetas = [];

        for (let i = 1; i <= numeroCasetas; i++) {
            nombresCasetas.push(entries[`nombre_caseta_${i}`]);
            costosCasetas.push(entries[`costo_caseta_${i}`]);
        }

        entries.nombre_caseta = nombresCasetas.join(', ');
        entries.costo_caseta = costosCasetas.join(', ');

        fetch('../rutas/rutas.php', {
            method: 'POST',
            body: JSON.stringify(entries),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    alert("Ruta agregada exitosamente");
                } else {
                    alert("Error al agregar la ruta: " + data.message);
                }
                modalAgregar.style.display = "none";
                btnConsultar.click();
            });
    });

    // Función para actualizar una ruta
    document.getElementById("formActualizarRuta").addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(this);
        // Agregar el ID de la ruta al FormData
        data.append('id', document.getElementById("ruta_id_upd").value);
        const entries = Object.fromEntries(data.entries());

        // Concatenar nombres y costos de casetas
        const numeroCasetas = entries.numero_casetas;
        const nombresCasetas = [];
        const costosCasetas = [];

        for (let i = 1; i <= numeroCasetas; i++) {
            nombresCasetas.push(entries[`nombre_caseta_${i}`]);
            costosCasetas.push(entries[`costo_caseta_${i}`]);
        }

        entries.nombre_caseta = nombresCasetas.join(', ');
        entries.costo_caseta = costosCasetas.join(', ');

        fetch('../rutas/rutas.php', {
            method: 'PUT',
            body: JSON.stringify(entries),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    alert("Ruta actualizada exitosamente");
                } else {
                    alert("Error al actualizar la ruta: " + data.message);
                }
                modalActualizar.style.display = "none";
                btnConsultar.click();
            });
    });

    // Función para eliminar una ruta con confirmación
    function deleteRuta(id) {
        if (confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
            fetch(`../rutas/rutas.php?id=${id}`, {
                method: 'DELETE',
                body: JSON.stringify({ id: id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.status === 'success') {
                        alert("Ruta eliminada exitosamente");
                    } else {
                        alert("Error al eliminar la ruta: " + data.message);
                    }
                    btnConsultar.click();
                });
        }
    }

    // Generar campos dinámicos de casetas según el número de casetas seleccionado
    function generateCasetasFields(numCasetas, container, nombresCasetas = "", costosCasetas = "") {
        container.innerHTML = ""; // Limpiar contenedor

        if (numCasetas > 0) {
            const nombreCasetasArray = nombresCasetas ? nombresCasetas.split(', ') : [];
            const costoCasetasArray = costosCasetas ? costosCasetas.split(', ') : [];

            for (let i = 0; i < numCasetas; i++) {
                const nombreCasetaValue = nombreCasetasArray[i] || "";
                const costoCasetaValue = costoCasetasArray[i] || "";

                const nombreCasetaLabel = document.createElement("label");
                nombreCasetaLabel.textContent = `Nombre de la Caseta ${i + 1}`;
                const nombreCasetaInput = document.createElement("input");
                nombreCasetaInput.type = "text";
                nombreCasetaInput.name = `nombre_caseta_${i + 1}`;
                nombreCasetaInput.value = nombreCasetaValue;
                nombreCasetaInput.required = true;

                const costoCasetaLabel = document.createElement("label");
                costoCasetaLabel.textContent = `Costo de la Caseta ${i + 1}`;
                const costoCasetaInput = document.createElement("input");
                costoCasetaInput.type = "text";
                costoCasetaInput.name = `costo_caseta_${i + 1}`;
                costoCasetaInput.value = costoCasetaValue;
                costoCasetaInput.required = true;

                container.appendChild(nombreCasetaLabel);
                container.appendChild(nombreCasetaInput);
                container.appendChild(costoCasetaLabel);
                container.appendChild(costoCasetaInput);
            }
        }
    }

    // Generar campos dinámicos al cambiar el número de casetas en la selección de agregar ruta
    numeroCasetasInput.addEventListener("change", function () {
        generateCasetasFields(this.value, casetasContainer);
    });

    // Generar campos dinámicos al cambiar el número de casetas en la selección de actualizar ruta
    numeroCasetasInputUpd.addEventListener("change", function () {
        generateCasetasFields(this.value, casetasContainerUpd);
    });
});

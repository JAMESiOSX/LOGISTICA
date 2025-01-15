document.addEventListener('DOMContentLoaded', function () {
    console.log("registro.js cargado y ejecutándose");

    const registerForm = document.getElementById('registerForm');

    if (registerForm.dataset.listenerAttached !== "true") {
        registerForm.dataset.listenerAttached = "true";

        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();

            console.log("Formulario de registro enviado");

            try {
                const nombre = document.getElementById('nombre').value;
                const apellidos = document.getElementById('apellidos').value;
                const correo = document.getElementById('correo').value;
                const rfc = document.getElementById('rfc').value;
                const curp = document.getElementById('curp').value;
                const telefono = document.getElementById('telefono').value;
                const direccion = document.getElementById('direccion').value;
                const nombre_empresa = document.getElementById('nombreEmpresa').value;
                const password = document.getElementById('passwordRegister').value;

                const cliente = {
                    nombre,
                    apellidos,
                    correo,
                    rfc,
                    curp,
                    telefono,
                    direccion,
                    nombre_empresa,
                    password
                };

                console.log("Datos del cliente:", cliente);

                fetch('REGISTRO/registro.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cliente)
                })
                .then(response => {
                    console.log("Respuesta recibida del servidor");
                    return response.json();
                })
                .then(data => {
                    console.log("Datos recibidos:", data);
                    if (data.status === 'success') {
                        showNotification('Registro exitoso.');
                        registerForm.reset();
                    } else {
                        showNotification('Error: ' + data.message, true);
                    }
                })
                .catch(error => {
                    console.error('Error en el fetch:', error);
                    showNotification('Error en la solicitud', true);
                });
            } catch (error) {
                console.error('Error en el procesamiento del formulario:', error);
                showNotification('Error en el formulario de registro', true);
            }
        });
    }
});

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#FF4C4C' : '#4CAF50';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

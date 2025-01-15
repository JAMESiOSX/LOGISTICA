document.addEventListener('DOMContentLoaded', function () {
    console.log("login.js cargado y ejecutándose");

    const loginForm = document.getElementById('loginForm');

    if (loginForm.dataset.listenerAttached !== "true") {
        loginForm.dataset.listenerAttached = "true";

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            console.log("Formulario de login enviado");

            try {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                const admin = {
                    email,
                    password
                };

                console.log("Datos del administrador:", admin);

                fetch('login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(admin)
                })
                .then(response => {
                    console.log("Respuesta recibida del servidor");
                    return response.json();
                })
                .then(data => {
                    console.log("Datos recibidos:", data);
                    if (data.status === 'success') {
                        showNotification(data.message);
                        setTimeout(() => {
                            window.location.href = '../inicio/inicio.html'; // Corregir la ruta de redirección
                        }, 2000);
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
                showNotification('Error en el formulario de login', true);
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

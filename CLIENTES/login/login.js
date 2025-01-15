function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#FF4C4C' : '#4CAF50'; // Rojo para errores, verde para éxito
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('passwordLogin').value;

        const user = {
            username,
            password
        };

        fetch('LOGIN/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showNotification(`Inicio de sesión exitoso, bienvenido ${data.name}`);
                document.getElementById('modalAuth').style.display = 'none'; // Cierra el modal después del login exitoso
                
                // Agregar un console.log para verificar el contenido de data.redirect
                console.log('Redirigiendo a:', data.redirect);
                console.log(data); // Imprimir todo el objeto de datos para verificar

                setTimeout(() => {
                    window.location.href = data.redirect; // Redirigir al panel del cliente
                }, 1000); // Añadir un ligero retraso para asegurar que la notificación se muestre
            } else {
                showNotification(data.message, true);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error en la solicitud', true);
        });
    });
});

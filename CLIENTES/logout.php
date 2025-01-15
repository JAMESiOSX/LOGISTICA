<?php
// Iniciar sesión
session_start();

// Destruir todas las sesiones
session_destroy();

// Redirigir a la página principal
header("Location: ../clientes/index.html");
exit();
?>

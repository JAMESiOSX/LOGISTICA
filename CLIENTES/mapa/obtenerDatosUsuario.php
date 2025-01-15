<?php
header("Content-Type: application/json");
session_start();

if (isset($_SESSION['correo'])) {
    $usuario = [
        'nombre' => $_SESSION['nombre'],
        'apellidos' => $_SESSION['apellidos'],
        'telefono' => $_SESSION['telefono'],
        'rfc' => $_SESSION['rfc'],
        'correo' => $_SESSION['correo'],
        'nombre_empresa' => $_SESSION['nombre_empresa'],
        'id_usuario' => $_SESSION['id']
    ];
    echo json_encode(['status' => 'success', 'usuario' => $usuario]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no logueado']);
}
?>

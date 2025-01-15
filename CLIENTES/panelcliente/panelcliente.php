<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../CONEXION/conexion.php";

// Iniciar sesión
session_start();

$response = array();

if (isset($_SESSION['id'])) {
    // Consultar la base de datos para obtener los detalles del usuario
    $userId = $_SESSION['id'];
    $query = "SELECT * FROM clientes WHERE id='$userId'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $response = ['status' => 'success', 'user' => $user];
    } else {
        $response = ['status' => 'error', 'message' => 'Usuario no encontrado.'];
    }
} else {
    $response = ['status' => 'error', 'message' => 'Usuario no logueado.'];
}

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

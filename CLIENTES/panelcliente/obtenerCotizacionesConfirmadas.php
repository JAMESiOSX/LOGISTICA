<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../CONEXION/conexion.php";

// Iniciar sesión
session_start();

if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no logueado']);
    exit();
}

$userId = $_SESSION['id'];

$query = "SELECT id, ruta, nombre_camion, peso, tipo_material, precio_total, fecha_salida, fecha_entrega 
          FROM contratos_clientes 
          WHERE estatus='confirmado' AND id_usuario='$userId'";
$result = $conn->query($query);
$cotizaciones = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $cotizaciones[] = $row;
    }
}

echo json_encode($cotizaciones);

// Cerrar la conexión
mysqli_close($conn);
?>
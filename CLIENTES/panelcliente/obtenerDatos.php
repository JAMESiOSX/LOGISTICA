<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../CONEXION/conexion.php";

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener rutas
    $rutasQuery = "SELECT * FROM rutas";
    $rutasResult = $conn->query($rutasQuery);
    $rutas = array();
    while ($row = $rutasResult->fetch_assoc()) {
        $rutas[] = $row;
    }

    // Obtener camiones
    $camionesQuery = "SELECT * FROM camiones";
    $camionesResult = $conn->query($camionesQuery);
    $camiones = array();
    while ($row = $camionesResult->fetch_assoc()) {
        $camiones[] = $row;
    }

    // Obtener tipos de material
    $materialesQuery = "SELECT * FROM tipo_material";
    $materialesResult = $conn->query($materialesQuery);
    $materiales = array();
    while ($row = $materialesResult->fetch_assoc()) {
        $materiales[] = $row;
    }

    $response = [
        'status' => 'success',
        'rutas' => $rutas,
        'camiones' => $camiones,
        'materiales' => $materiales
    ];
} else {
    $response = ['status' => 'error', 'message' => 'Método no permitido.'];
}

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

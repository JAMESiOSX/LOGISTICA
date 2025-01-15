<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../CONEXION/conexion.php";

$response = array();

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        throw new Exception("Datos inválidos en el cuerpo de la solicitud.");
    }

    $cotizacionId = $conn->real_escape_string($data['cotizacionId']);
    $estatus = $conn->real_escape_string($data['estatus']);

    $query = "UPDATE contratos_clientes_maps SET estatus='$estatus' WHERE id='$cotizacionId'";

    if ($conn->query($query) !== TRUE) {
        throw new Exception("Error al actualizar la cotización: " . $conn->error);
    }

    $response = ['status' => 'success', 'message' => 'Estatus de la cotización actualizado exitosamente.'];

} catch (Exception $e) {
    error_log($e->getMessage());
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

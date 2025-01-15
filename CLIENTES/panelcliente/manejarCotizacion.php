<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../CONEXION/conexion.php";

// Iniciar sesión
session_start();

$response = array();

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        throw new Exception("Datos inválidos en el cuerpo de la solicitud.");
    }

    if (isset($_SESSION['id'])) {
        // Usuario logueado
        $userId = $_SESSION['id'];
        $nombre = $conn->real_escape_string($data['nombre']);
        $apellidos = $conn->real_escape_string($data['apellidos']);
        $telefono = $conn->real_escape_string($data['telefono']);
        $rfc = $conn->real_escape_string($data['rfc']);
        $correo = $conn->real_escape_string($data['correo']);
        $nombre_empresa = $conn->real_escape_string($data['nombre_empresa']);
        $rutaId = $conn->real_escape_string($data['rutaId']);
        $camionId = $conn->real_escape_string($data['camionId']);
        $peso = $conn->real_escape_string($data['peso']);
        $tipo_material = $conn->real_escape_string($data['tipo_material']);
        $precio_total = $conn->real_escape_string($data['precio_total']);
        $estatus = $conn->real_escape_string($data['estatus']);
        $fecha_salida = $conn->real_escape_string($data['fecha_salida']);
        $fecha_entrega = $conn->real_escape_string($data['fecha_entrega']);

        // Obtener nombres de la ruta, camión y material
        $rutaQuery = "SELECT CONCAT(origen, ' - ', destino) as nombre_ruta FROM rutas WHERE id='$rutaId'";
        $rutaResult = $conn->query($rutaQuery);
        if (!$rutaResult) {
            throw new Exception("Error al obtener la ruta: " . $conn->error);
        }
        $ruta = $rutaResult->fetch_assoc();

        $camionQuery = "SELECT CONCAT(tipo_transporte, ' - ', capacidad_carga, ' toneladas') as nombre_camion FROM camiones WHERE id='$camionId'";
        $camionResult = $conn->query($camionQuery);
        if (!$camionResult) {
            throw new Exception("Error al obtener el camión: " . $conn->error);
        }
        $camion = $camionResult->fetch_assoc();

        $materialQuery = "SELECT nombre_material FROM tipo_material WHERE id_material='$tipo_material'";
        $materialResult = $conn->query($materialQuery);
        if (!$materialResult) {
            throw new Exception("Error al obtener el material: " . $conn->error);
        }
        $material = $materialResult->fetch_assoc();

        $nombre_ruta = $conn->real_escape_string($ruta['nombre_ruta']);
        $nombre_camion = $conn->real_escape_string($camion['nombre_camion']);
        $nombre_material = $conn->real_escape_string($material['nombre_material']);

        $query = "INSERT INTO contratos_clientes (id_usuario, nombre, apellidos, telefono, rfc, correo, nombre_empresa, ruta, nombre_camion, peso, tipo_material, precio_total, estatus, fecha_salida, fecha_entrega) 
                  VALUES ('$userId', '$nombre', '$apellidos', '$telefono', '$rfc', '$correo', '$nombre_empresa', '$nombre_ruta', '$nombre_camion', '$peso', '$nombre_material', '$precio_total', '$estatus', '$fecha_salida', '$fecha_entrega')";

        if ($conn->query($query) !== TRUE) {
            throw new Exception("Error al manejar la cotización: " . $conn->error);
        }

        $response = ['status' => 'success', 'message' => 'Cotización manejada exitosamente.'];
    } else {
        // Cotización rápida sin usuario logueado
        $nombre_completo = $conn->real_escape_string($data['nombre_completo']);
        $correo = $conn->real_escape_string($data['correo']);
        $telefono = $conn->real_escape_string($data['telefono']);
        $rutaId = $conn->real_escape_string($data['rutaId']);
        $camionId = $conn->real_escape_string($data['camionId']);
        $peso = $conn->real_escape_string($data['peso']);
        $tipo_material = $conn->real_escape_string($data['tipo_material']);
        $fecha_salida = $conn->real_escape_string($data['fecha_salida']);
        $fecha_entrega = $conn->real_escape_string($data['fecha_entrega']);
        $costo = $conn->real_escape_string($data['costo']);
        $estatus = $conn->real_escape_string($data['estatus']);

        // Obtener nombres de la ruta, camión y material
        $rutaQuery = "SELECT CONCAT(origen, ' - ', destino) as nombre_ruta FROM rutas WHERE id='$rutaId'";
        $rutaResult = $conn->query($rutaQuery);
        if (!$rutaResult) {
            throw new Exception("Error al obtener la ruta: " . $conn->error);
        }
        $ruta = $rutaResult->fetch_assoc();

        $camionQuery = "SELECT CONCAT(tipo_transporte, ' - ', capacidad_carga, ' toneladas') as nombre_camion FROM camiones WHERE id='$camionId'";
        $camionResult = $conn->query($camionQuery);
        if (!$camionResult) {
            throw new Exception("Error al obtener el camión: " . $conn->error);
        }
        $camion = $camionResult->fetch_assoc();

        $materialQuery = "SELECT nombre_material FROM tipo_material WHERE id_material='$tipo_material'";
        $materialResult = $conn->query($materialQuery);
        if (!$materialResult) {
            throw new Exception("Error al obtener el material: " . $conn->error);
        }
        $material = $materialResult->fetch_assoc();

        $nombre_ruta = $conn->real_escape_string($ruta['nombre_ruta']);
        $nombre_camion = $conn->real_escape_string($camion['nombre_camion']);
        $nombre_material = $conn->real_escape_string($material['nombre_material']);

        $query = "INSERT INTO cotizaciones_rapidas (nombre_completo, correo, telefono, ruta, nombre_camion, peso, tipo_material, fecha_salida, fecha_entrega, costo, estatus) 
                  VALUES ('$nombre_completo', '$correo', '$telefono', '$nombre_ruta', '$nombre_camion', '$peso', '$nombre_material', '$fecha_salida', '$fecha_entrega', '$costo', '$estatus')";

        if ($conn->query($query) !== TRUE) {
            throw new Exception("Error al manejar la cotización: " . $conn->error);
        }

        $response = ['status' => 'success', 'message' => 'Cotización rápida registrada correctamente.'];
    }

} catch (Exception $e) {
    error_log($e->getMessage());
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

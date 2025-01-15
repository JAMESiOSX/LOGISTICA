<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "hola123";
$dbname = "transporte_cotizaciones";
$port = 3306;

$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$response = array();

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        throw new Exception("Datos inválidos en el cuerpo de la solicitud.");
    }

    $nombre_completo = $conn->real_escape_string($data['nombre_completo']);
    $correo = $conn->real_escape_string($data['correo']);
    $telefono = $conn->real_escape_string($data['telefono']);
    $rutaId = $conn->real_escape_string($data['rutaId']);
    $camionId = $conn->real_escape_string($data['camionId']);
    $peso = $conn->real_escape_string($data['peso']);
    $tipo_mercancia = $conn->real_escape_string($data['tipo_material']);
    $fecha_salida = $conn->real_escape_string($data['fecha_salida']);
    $fecha_entrega = $conn->real_escape_string($data['fecha_entrega']);
    $costo = $conn->real_escape_string($data['costo']);
    $estatus = $conn->real_escape_string($data['estatus']);

    // Log de datos recibidos
    error_log("Datos recibidos: " . json_encode($data));

    // Obtener nombres de la ruta, camión y material
    $rutaQuery = "SELECT origen, destino FROM rutas WHERE id='$rutaId'";
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

    $materialQuery = "SELECT nombre_material FROM tipo_material WHERE id_material='$tipo_mercancia'";
    $materialResult = $conn->query($materialQuery);
    if (!$materialResult) {
        throw new Exception("Error al obtener el material: " . $conn->error);
    }
    $material = $materialResult->fetch_assoc();

    $origen = $conn->real_escape_string($ruta['origen']);
    $destino = $conn->real_escape_string($ruta['destino']);
    $nombre_camion = $conn->real_escape_string($camion['nombre_camion']);
    $nombre_material = $conn->real_escape_string($material['nombre_material']);

    // Log de datos procesados
    error_log("Datos procesados: " . json_encode([
        'origen' => $origen,
        'destino' => $destino,
        'nombre_camion' => $nombre_camion,
        'nombre_material' => $nombre_material
    ]));

    $query = "INSERT INTO cotizaciones_rapidas (nombre_completo, correo, telefono, origen, destino, nombre_camion, peso, tipo_mercancia, fecha_salida, fecha_entrega, costo, estatus) 
              VALUES ('$nombre_completo', '$correo', '$telefono', '$origen', '$destino', '$nombre_camion', '$peso', '$nombre_material', '$fecha_salida', '$fecha_entrega', '$costo', '$estatus')";

    if ($conn->query($query) !== TRUE) {
        throw new Exception("Error al manejar la cotización: " . $conn->error);
    }

    $response = ['status' => 'success', 'message' => 'Cotización rápida registrada correctamente.'];

} catch (Exception $e) {
    error_log($e->getMessage());
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
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
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
        $query = "SELECT * FROM cotizaciones_rapidas WHERE nombre_completo LIKE '%$search%' OR correo LIKE '%$search%'";
        $result = $conn->query($query);

        $cotizaciones = array();
        while ($row = $result->fetch_assoc()) {
            $cotizaciones[] = $row;
        }

        $response = ['status' => 'success', 'data' => $cotizaciones];
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) throw new Exception("Datos inválidos en el cuerpo de la solicitud.");

        $nombre_completo = $conn->real_escape_string($input['nombre_completo']);
        $correo = $conn->real_escape_string($input['correo']);
        $telefono = $conn->real_escape_string($input['telefono']);
        $origen = $conn->real_escape_string($input['origen']);
        $destino = $conn->real_escape_string($input['destino']);
        $peso = $conn->real_escape_string($input['peso']);
        $tipo_mercancia = $conn->real_escape_string($input['tipo_mercancia']);
        $fecha_salida = $conn->real_escape_string($input['fecha_salida']);
        $fecha_entrega = $conn->real_escape_string($input['fecha_entrega']);
        $costo = $conn->real_escape_string($input['costo']);
        $estatus = $conn->real_escape_string($input['estatus']);

        $query = "INSERT INTO cotizaciones_rapidas (nombre_completo, correo, telefono, origen, destino, peso, tipo_mercancia, fecha_salida, fecha_entrega, costo, estatus, fecha_creacion) 
                  VALUES ('$nombre_completo', '$correo', '$telefono', '$origen', '$destino', '$peso', '$tipo_mercancia', '$fecha_salida', '$fecha_entrega', '$costo', '$estatus', NOW())";
        
        if ($conn->query($query)) {
            $response = ['status' => 'success', 'message' => 'Cotización rápida registrada correctamente.'];
        } else {
            throw new Exception("Error al insertar: " . $conn->error);
        }
    } else {
        throw new Exception("Método no permitido.");
    }
} catch (Exception $e) {
    error_log("Error en cotizaciones.php: " . $e->getMessage());
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

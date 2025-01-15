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
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) throw new Exception("Datos inválidos en el cuerpo de la solicitud.");

        $nombre = $conn->real_escape_string($input['nombre']);
        $apellidos = $conn->real_escape_string($input['apellidos']);
        $correo = $conn->real_escape_string($input['correo']);
        $rfc = $conn->real_escape_string($input['rfc']);
        $curp = $conn->real_escape_string($input['curp']);
        $telefono = $conn->real_escape_string($input['telefono']);
        $direccion = $conn->real_escape_string($input['direccion']);
        $nombre_empresa = $conn->real_escape_string($input['nombre_empresa']);
        $password = $conn->real_escape_string($input['password']); // Almacenar la contraseña sin encriptar

        $query = "INSERT INTO clientes (nombre, apellidos, correo, rfc, curp, telefono, direccion, nombre_empresa, password) 
                  VALUES ('$nombre', '$apellidos', '$correo', '$rfc', '$curp', '$telefono', '$direccion', '$nombre_empresa', '$password')";
        
        if ($conn->query($query)) {
            $response = ['status' => 'success', 'message' => 'Cliente registrado correctamente.'];
        } else {
            throw new Exception("Error al insertar: " . $conn->error);
        }
    } else {
        throw new Exception("Método no permitido.");
    }
} catch (Exception $e) {
    error_log("Error en registro.php: " . $e->getMessage());
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

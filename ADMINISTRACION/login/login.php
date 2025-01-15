<?php
session_start();
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

        $email = $conn->real_escape_string($input['email']);
        $password = $conn->real_escape_string($input['password']);

        $query = "SELECT * FROM administradores WHERE email = '$email'";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $admin = $result->fetch_assoc();
            if ($password === $admin['password']) {
                $_SESSION['admin'] = $admin['nombre'];
                $response = ['status' => 'success', 'message' => 'Bienvenido, ' . $admin['nombre']];
            } else {
                throw new Exception("Contraseña incorrecta.");
            }
        } else {
            throw new Exception("Usuario no encontrado.");
        }
    } else {
        throw new Exception("Método no permitido.");
    }
} catch (Exception $e) {
    error_log("Error en login.php: " . $e->getMessage());
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

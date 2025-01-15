<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../CONEXION/conexion.php";

// Iniciar sesión
session_start();

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $userId = $_SESSION['id'];

    $nombre = $conn->real_escape_string($input['nombre']);
    $apellidos = $conn->real_escape_string($input['apellidos']);
    $correo = $conn->real_escape_string($input['correo']);
    $rfc = $conn->real_escape_string($input['rfc']);
    $curp = $conn->real_escape_string($input['curp']);
    $telefono = $conn->real_escape_string($input['telefono']);
    $direccion = $conn->real_escape_string($input['direccion']);
    $nombre_empresa = $conn->real_escape_string($input['nombre_empresa']);
    $password = !empty($input['password']) ? $conn->real_escape_string($input['password']) : null;

    // Construir la consulta de actualización
    $query = "UPDATE clientes SET nombre='$nombre', apellidos='$apellidos', correo='$correo', rfc='$rfc', curp='$curp', telefono='$telefono', direccion='$direccion', nombre_empresa='$nombre_empresa'";
    if ($password) {
        $query .= ", password='$password'";
    }
    $query .= " WHERE id='$userId'";

    if ($conn->query($query) === TRUE) {
        $response = ['status' => 'success', 'message' => 'Perfil actualizado exitosamente.'];
    } else {
        $response = ['status' => 'error', 'message' => 'Error al actualizar el perfil: ' . $conn->error];
    }
} else {
    $response = ['status' => 'error', 'message' => 'Método no permitido.'];
}

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

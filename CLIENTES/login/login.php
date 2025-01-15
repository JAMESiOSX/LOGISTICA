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
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) throw new Exception("Datos inválidos en el cuerpo de la solicitud.");

        $correo = $conn->real_escape_string($input['username']);
        $password = $conn->real_escape_string($input['password']);

        // Realiza la consulta para verificar el usuario y la contraseña
        $query = "SELECT * FROM clientes WHERE correo='$correo' AND password='$password'";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            // Guardar datos del usuario en la sesión
            $_SESSION['correo'] = $correo;
            $_SESSION['id'] = $user['id'];
            $_SESSION['nombre'] = $user['nombre'];
            $_SESSION['apellidos'] = $user['apellidos'];
            $_SESSION['telefono'] = $user['telefono'];
            $_SESSION['rfc'] = $user['rfc'];
            $_SESSION['nombre_empresa'] = $user['nombre_empresa'];

            // Redirigir al panel del cliente
            $response = [
                'status' => 'success',
                'message' => 'Inicio de sesión exitoso.',
                'redirect' => '../CLIENTES/panelcliente/panelcliente.html',
                'name' => $user['nombre']
            ];
        } else {
            throw new Exception("Usuario o contraseña incorrectos.");
        }
    } else {
        throw new Exception("Método no permitido.");
    }
} catch (Exception $e) {
    error_log("Error en login.php: " . $e->getMessage());
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);
?>

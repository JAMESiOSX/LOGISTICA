<?php
// Incluir archivo de conexión
include('../conexionadg/conexionadg.php');

// Configuración de la respuesta en formato JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir solicitudes de cualquier origen
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE'); // Métodos permitidos
header('Access-Control-Allow-Headers: Content-Type'); // Permitir Content-Type en las cabeceras

// Comprobar si el método de la solicitud es OPTIONS (para manejar CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtenemos el método de la solicitud
$method = $_SERVER['REQUEST_METHOD'];

// Inicializamos la respuesta
$response = array();

// Realizar operaciones según el tipo de solicitud
try {
    switch ($method) {
        case 'GET': // Consultar clientes
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $query = "SELECT * FROM clientes WHERE id = '$id'";
            } elseif (isset($_GET['nombre'])) {
                $nombre = $_GET['nombre'];
                $query = "SELECT * FROM clientes WHERE nombre LIKE '%$nombre%' OR apellidos LIKE '%$nombre%'";
            } else {
                $query = "SELECT * FROM clientes";
            }

            $result = mysqli_query($conn, $query);

            if ($result) {
                $clientes = array();
                while ($row = mysqli_fetch_assoc($result)) {
                    $clientes[] = $row;
                }
                $response = $clientes; // Datos de los clientes
            } else {
                $response = array('error' => 'No se encontraron clientes');
            }
            break;

        case 'POST': // Agregar un nuevo cliente
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);

            $nombre = $data['nombre'] ?? '';
            $apellidos = $data['apellidos'] ?? '';
            $correo = $data['correo'] ?? '';
            $rfc = $data['rfc'] ?? '';
            $curp = $data['curp'] ?? '';
            $telefono = $data['telefono'] ?? '';
            $direccion = $data['direccion'] ?? '';
            $nombre_empresa = $data['nombre_empresa'] ?? '';
            $password = $data['password'] ?? '';

            // Inserción de los datos en la base de datos
            $query = "INSERT INTO clientes (nombre, apellidos, correo, rfc, curp, telefono, direccion, nombre_empresa, password) 
                      VALUES ('$nombre', '$apellidos', '$correo', '$rfc', '$curp', '$telefono', '$direccion', '$nombre_empresa', '$password')";

            if (mysqli_query($conn, $query)) {
                $response = array('status' => 'success', 'message' => 'Cliente agregado exitosamente');
            } else {
                throw new Exception("Error al agregar el cliente: " . mysqli_error($conn));
            }
            break;

        case 'PUT': // Actualizar un cliente
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);

            if (isset($data['id'])) {
                $id = $data['id'];
                $nombre = $data['nombre'] ?? '';
                $apellidos = $data['apellidos'] ?? '';
                $correo = $data['correo'] ?? '';
                $rfc = $data['rfc'] ?? '';
                $curp = $data['curp'] ?? '';
                $telefono = $data['telefono'] ?? '';
                $direccion = $data['direccion'] ?? '';
                $nombre_empresa = $data['nombre_empresa'] ?? '';
                $password = !empty($data['password']) ? $data['password'] : null;

                // Actualización de los datos
                $query = "UPDATE clientes SET 
                          nombre = '$nombre', 
                          apellidos = '$apellidos', 
                          correo = '$correo', 
                          rfc = '$rfc', 
                          curp = '$curp', 
                          telefono = '$telefono', 
                          direccion = '$direccion', 
                          nombre_empresa = '$nombre_empresa'";
                if ($password) {
                    $query .= ", password = '$password'";
                }
                $query .= " WHERE id = '$id'";

                if (mysqli_query($conn, $query)) {
                    $response = array('status' => 'success', 'message' => 'Cliente actualizado exitosamente');
                } else {
                    throw new Exception("Error al actualizar el cliente: " . mysqli_error($conn));
                }
            } else {
                throw new Exception("ID de cliente no proporcionado");
            }
            break;

        case 'DELETE': // Eliminar un cliente
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (isset($data['id'])) {
                $id = $data['id'];

                // Eliminar el cliente
                $query = "DELETE FROM clientes WHERE id = '$id'";

                if (mysqli_query($conn, $query)) {
                    $response = array('status' => 'success', 'message' => 'Cliente eliminado exitosamente');
                } else {
                    throw new Exception("Error al eliminar el cliente: " . mysqli_error($conn));
                }
            } else {
                throw new Exception("ID de cliente no proporcionado");
            }
            break;

        default:
            $response = array('error' => 'Método no permitido');
            break;
    }
} catch (Exception $e) {
    $response = array('status' => 'error', 'message' => $e->getMessage());
}

// Devolver la respuesta como JSON
echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

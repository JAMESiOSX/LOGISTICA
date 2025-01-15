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
        case 'GET': // Consultar choferes
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $query = "SELECT * FROM choferes WHERE id = '$id'";
            } elseif (isset($_GET['nombre'])) {
                $nombre = $_GET['nombre'];
                $query = "SELECT * FROM choferes WHERE nombre_completo LIKE '%$nombre%'";
            } else {
                $query = "SELECT * FROM choferes";
            }

            $result = mysqli_query($conn, $query);

            if ($result) {
                $choferes = array();
                while ($row = mysqli_fetch_assoc($result)) {
                    $choferes[] = $row;
                }
                $response = $choferes; // Datos de los choferes
            } else {
                $response = array('error' => 'No se encontraron choferes');
            }
            break;

        case 'POST': // Agregar un nuevo chofer
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);

            $rfc = $data['rfc'] ?? '';
            $nombre_completo = $data['nombre_completo'] ?? '';
            $numero_licencia = $data['numero_licencia'] ?? '';
            $numero_seguridad_social = $data['numero_seguridad_social'] ?? '';
            $numero_telefono = $data['numero_telefono'] ?? '';

            // Inserción de los datos en la base de datos
            $query = "INSERT INTO choferes (rfc, nombre_completo, numero_licencia, numero_seguridad_social, numero_telefono) 
                      VALUES ('$rfc', '$nombre_completo', '$numero_licencia', '$numero_seguridad_social', '$numero_telefono')";

            if (mysqli_query($conn, $query)) {
                $response = array('status' => 'success', 'message' => 'Chofer agregado exitosamente');
            } else {
                throw new Exception("Error al agregar el chofer: " . mysqli_error($conn));
            }
            break;

        case 'PUT': // Actualizar un chofer
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);

            if (isset($data['id'])) {
                $id = $data['id'];
                $rfc = $data['rfc'] ?? '';
                $nombre_completo = $data['nombre_completo'] ?? '';
                $numero_licencia = $data['numero_licencia'] ?? '';
                $numero_seguridad_social = $data['numero_seguridad_social'] ?? '';
                $numero_telefono = $data['numero_telefono'] ?? '';

                // Actualización de los datos
                $query = "UPDATE choferes SET 
                          rfc = '$rfc', 
                          nombre_completo = '$nombre_completo', 
                          numero_licencia = '$numero_licencia', 
                          numero_seguridad_social = '$numero_seguridad_social', 
                          numero_telefono = '$numero_telefono' 
                          WHERE id = '$id'";

                if (mysqli_query($conn, $query)) {
                    $response = array('status' => 'success', 'message' => 'Chofer actualizado exitosamente');
                } else {
                    throw new Exception("Error al actualizar el chofer: " . mysqli_error($conn));
                }
            } else {
                throw new Exception("ID de chofer no proporcionado");
            }
            break;

        case 'DELETE': // Eliminar un chofer
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (isset($data['id'])) {
                $id = $data['id'];

                // Eliminar el chofer
                $query = "DELETE FROM choferes WHERE id = '$id'";

                if (mysqli_query($conn, $query)) {
                    $response = array('status' => 'success', 'message' => 'Chofer eliminado exitosamente');
                } else {
                    throw new Exception("Error al eliminar el chofer: " . mysqli_error($conn));
                }
            } else {
                throw new Exception("ID de chofer no proporcionado");
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

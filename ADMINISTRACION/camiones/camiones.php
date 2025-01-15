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
        case 'GET': // Consultar camiones
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $query = "SELECT * FROM camiones WHERE id = '$id'";
            } elseif (isset($_GET['nombre'])) {
                $nombre = $_GET['nombre'];
                $query = "SELECT * FROM camiones WHERE tipo_transporte LIKE '%$nombre%'";
            } else {
                $query = "SELECT * FROM camiones";
            }

            $result = mysqli_query($conn, $query);

            if ($result) {
                $camiones = array();
                while ($row = mysqli_fetch_assoc($result)) {
                    $camiones[] = $row;
                }
                $response = $camiones; // Datos de los camiones
            } else {
                $response = array('error' => 'No se encontraron camiones');
            }
            break;

        case 'POST': // Agregar un nuevo camión
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);

            $tipo_transporte = $data['tipo_transporte'] ?? '';
            $tipo_vehiculo = $data['tipo_vehiculo'] ?? '';
            $placas = $data['placas_transporte'] ?? '';
            $economico = $data['numero_economico'] ?? '';
            $modelo = $data['modelo_vehiculo'] ?? '';
            $configuracion = $data['configuracion_vehicular'] ?? '';
            $permiso_sct = $data['tipo_permiso_sct'] ?? '';
            $num_permiso = $data['numero_permiso_sct'] ?? '';
            $aseguradora = $data['nombre_aseguradora'] ?? '';
            $num_poliza = $data['numero_poliza'] ?? '';
            $rendimiento = $data['rendimiento'] ?? '0';
            $capacidad_carga = $data['capacidad_carga'] ?? '0';

            // Inserción de los datos en la base de datos
            $query = "INSERT INTO camiones (tipo_transporte, tipo_vehiculo, placas_transporte, numero_economico, modelo_vehiculo, configuracion_vehicular, tipo_permiso_sct, numero_permiso_sct, nombre_aseguradora, numero_poliza, rendimiento, capacidad_carga) 
                      VALUES ('$tipo_transporte', '$tipo_vehiculo', '$placas', '$economico', '$modelo', '$configuracion', '$permiso_sct', '$num_permiso', '$aseguradora', '$num_poliza', '$rendimiento', '$capacidad_carga')";

            if (mysqli_query($conn, $query)) {
                $response = array('status' => 'success', 'message' => 'Camión agregado exitosamente');
            } else {
                throw new Exception("Error al agregar el camión: " . mysqli_error($conn));
            }
            break;

        case 'PUT': // Actualizar un camión
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);

            if (isset($data['id'])) {
                $id = $data['id'];
                $tipo_transporte = $data['tipo_transporte'] ?? '';
                $tipo_vehiculo = $data['tipo_vehiculo'] ?? '';
                $placas = $data['placas_transporte'] ?? '';
                $economico = $data['numero_economico'] ?? '';
                $modelo = $data['modelo_vehiculo'] ?? '';
                $configuracion = $data['configuracion_vehicular'] ?? '';
                $permiso_sct = $data['tipo_permiso_sct'] ?? '';
                $num_permiso = $data['numero_permiso_sct'] ?? '';
                $aseguradora = $data['nombre_aseguradora'] ?? '';
                $num_poliza = $data['numero_poliza'] ?? '';
                $rendimiento = $data['rendimiento'] ?? '0';
                $capacidad_carga = $data['capacidad_carga'] ?? '0';

                // Actualización de los datos
                $query = "UPDATE camiones SET 
                          tipo_transporte = '$tipo_transporte', 
                          tipo_vehiculo = '$tipo_vehiculo', 
                          placas_transporte = '$placas', 
                          numero_economico = '$economico', 
                          modelo_vehiculo = '$modelo', 
                          configuracion_vehicular = '$configuracion', 
                          tipo_permiso_sct = '$permiso_sct', 
                          numero_permiso_sct = '$num_permiso', 
                          nombre_aseguradora = '$aseguradora', 
                          numero_poliza = '$num_poliza', 
                          rendimiento = '$rendimiento', 
                          capacidad_carga = '$capacidad_carga' 
                          WHERE id = '$id'";

                if (mysqli_query($conn, $query)) {
                    $response = array('status' => 'success', 'message' => 'Camión actualizado exitosamente');
                } else {
                    throw new Exception("Error al actualizar el camión: " . mysqli_error($conn));
                }
            } else {
                throw new Exception("ID de camión no proporcionado");
            }
            break;

        case 'DELETE': // Eliminar un camión
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (isset($data['id'])) {
                $id = $data['id'];

                // Eliminar el camión
                $query = "DELETE FROM camiones WHERE id = '$id'";

                if (mysqli_query($conn, $query)) {
                    $response = array('status' => 'success', 'message' => 'Camión eliminado exitosamente');
                } else {
                    throw new Exception("Error al eliminar el camión: " . mysqli_error($conn));
                }
            } else {
                throw new Exception("ID de camión no proporcionado");
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

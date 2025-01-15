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
        case 'GET': // Consultar rutas
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $query = "SELECT * FROM rutas WHERE id = '$id'";
            } elseif (isset($_GET['nombre'])) {
                $nombre = $_GET['nombre'];
                $query = "SELECT * FROM rutas WHERE origen LIKE '%$nombre%' OR destino LIKE '%$nombre%'";
            } else {
                $query = "SELECT * FROM rutas";
            }

            $result = mysqli_query($conn, $query);

            if ($result) {
                $rutas = array();
                while ($row = mysqli_fetch_assoc($result)) {
                    $rutas[] = $row;
                }
                $response = $rutas; // Datos de las rutas
            } else {
                $response = array('error' => 'No se encontraron rutas');
            }
            break;

        case 'POST': // Agregar una nueva ruta
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);

            $origen = $data['origen'] ?? '';
            $destino = $data['destino'] ?? '';
            $distancia = $data['distancia'] ?? '';
            $numero_casetas = $data['numero_casetas'] ?? 0;
            $nombres_casetas = [];
            $costos_casetas = [];

            for ($i = 1; $i <= $numero_casetas; $i++) {
                $nombres_casetas[] = $data["nombre_caseta_$i"] ?? '';
                $costos_casetas[] = $data["costo_caseta_$i"] ?? '';
            }

            $nombre_caseta = implode(', ', $nombres_casetas);
            $costo_caseta = implode(', ', $costos_casetas);
            $tiempo_aproximado = $data['tiempo_aproximado'] ?? '';
            $fecha_ruta = $data['fecha_ruta'] ?? '';

            // Inserción de los datos en la base de datos
            $query = "INSERT INTO rutas (origen, destino, distancia, numero_casetas, nombre_caseta, costo_caseta, tiempo_aproximado, fecha_ruta) 
                      VALUES ('$origen', '$destino', '$distancia', '$numero_casetas', '$nombre_caseta', '$costo_caseta', '$tiempo_aproximado', '$fecha_ruta')";

            if (mysqli_query($conn, $query)) {
                $response = array('status' => 'success', 'message' => 'Ruta agregada exitosamente');
            } else {
                throw new Exception("Error al agregar la ruta: " . mysqli_error($conn));
            }
            break;

        case 'PUT': // Actualizar una ruta
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);

            if (isset($data['id'])) {
                $id = $data['id'];
                $origen = $data['origen'] ?? '';
                $destino = $data['destino'] ?? '';
                $distancia = $data['distancia'] ?? '';
                $numero_casetas = $data['numero_casetas'] ?? 0;
                $nombres_casetas = [];
                $costos_casetas = [];

                for ($i = 1; $i <= $numero_casetas; $i++) {
                    $nombres_casetas[] = $data["nombre_caseta_$i"] ?? '';
                    $costos_casetas[] = $data["costo_caseta_$i"] ?? '';
                }

                $nombre_caseta = implode(', ', $nombres_casetas);
                $costo_caseta = implode(', ', $costos_casetas);
                $tiempo_aproximado = $data['tiempo_aproximado'] ?? '';
                $fecha_ruta = $data['fecha_ruta'] ?? '';

                // Actualización de los datos
                $query = "UPDATE rutas SET 
                          origen = '$origen', 
                          destino = '$destino', 
                          distancia = '$distancia', 
                          numero_casetas = '$numero_casetas', 
                          nombre_caseta = '$nombre_caseta', 
                          costo_caseta = '$costo_caseta', 
                          tiempo_aproximado = '$tiempo_aproximado', 
                          fecha_ruta = '$fecha_ruta' 
                          WHERE id = '$id'";

                if (mysqli_query($conn, $query)) {
                    $response = array('status' => 'success', 'message' => 'Ruta actualizada exitosamente');
                } else {
                    throw new Exception("Error al actualizar la ruta: " . mysqli_error($conn));
                }
            } else {
                throw new Exception("ID de ruta no proporcionado");
            }
            break;

        case 'DELETE': // Eliminar una ruta
            // Obtener datos del cuerpo de la solicitud (en formato JSON)
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (isset($data['id'])) {
                $id = $data['id'];

                // Eliminar la ruta
                $query = "DELETE FROM rutas WHERE id = '$id'";

                if (mysqli_query($conn, $query)) {
                    $response = array('status' => 'success', 'message' => 'Ruta eliminada exitosamente');
                } else {
                    throw new Exception("Error al eliminar la ruta: " . mysqli_error($conn));
                }
            } else {
                throw new Exception("ID de ruta no proporcionado");
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

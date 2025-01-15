<?php
// Incluir archivo de conexión
include('../conexionadg/conexionadg.php');

// Configuración de la respuesta en formato JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

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
        case 'GET':
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $query1 = "SELECT id, nombre, apellidos, ruta, fecha_creacion, 'contratos_clientes' as source FROM contratos_clientes WHERE id = '$id'";
                $query2 = "SELECT id, nombre, apellidos, origen as ruta, fecha_creacion, 'contratos_clientes_maps' as source FROM contratos_clientes_maps WHERE id = '$id'";
            } elseif (isset($_GET['nombre'])) {
                $nombre = $conn->real_escape_string($_GET['nombre']);
                $query1 = "SELECT id, nombre, apellidos, ruta, fecha_creacion, 'contratos_clientes' as source FROM contratos_clientes WHERE nombre LIKE '%$nombre%' OR apellidos LIKE '%$nombre%'";
                $query2 = "SELECT id, nombre, apellidos, origen as ruta, fecha_creacion, 'contratos_clientes_maps' as source FROM contratos_clientes_maps WHERE nombre LIKE '%$nombre%' OR apellidos LIKE '%$nombre%'";
            } else {
                $query1 = "SELECT id, nombre, apellidos, ruta, fecha_creacion, 'contratos_clientes' as source FROM contratos_clientes";
                $query2 = "SELECT id, nombre, apellidos, origen as ruta, fecha_creacion, 'contratos_clientes_maps' as source FROM contratos_clientes_maps";
            }

            $result1 = mysqli_query($conn, $query1);
            $result2 = mysqli_query($conn, $query2);

            $contratos = array();
            if ($result1) {
                while ($row = mysqli_fetch_assoc($result1)) {
                    $contratos[] = $row;
                }
            }

            if ($result2) {
                while ($row = mysqli_fetch_assoc($result2)) {
                    $contratos[] = $row;
                }
            }

            // Ordenar los contratos por fecha de creación
            usort($contratos, function($a, $b) {
                return strtotime($a['fecha_creacion']) - strtotime($b['fecha_creacion']);
            });

            // Asignar nuevos IDs secuenciales
            $contador = 1;
            foreach ($contratos as &$contrato) {
                $contrato['nuevo_id'] = $contador++;
            }

            $response = $contratos;
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

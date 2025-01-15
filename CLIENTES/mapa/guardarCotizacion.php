<?php
header("Content-Type: application/json");
require_once "../CONEXION/conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data['nombre'];
$apellidos = $data['apellidos'];
$telefono = $data['telefono'];
$rfc = $data['rfc'];
$correo = $data['correo'];
$nombre_empresa = $data['nombre_empresa'];
$origen = $data['origen'];
$destino = $data['destino'];
$distancia = $data['distancia'];
$duracion = $data['duracion'];
$peajes = $data['peajes'];
$tipo_vehiculo = $data['tipo_vehiculo'];
$tipo_material = $data['tipo_material'];
$peso = $data['peso'];
$fecha_salida = $data['fecha_salida'];
$fecha_entrega = $data['fecha_entrega'];
$estatus = $data['estatus'];
$precio_total = $data['precio_total'];
$id_usuario = $data['id_usuario'];

$query = "INSERT INTO contratos_clientes_maps (nombre, apellidos, telefono, rfc, correo, nombre_empresa, origen, destino, distancia, duracion, peajes, tipo_vehiculo, tipo_material, peso, fecha_salida, fecha_entrega, estatus, precio_total, id_usuario)
          VALUES ('$nombre', '$apellidos', '$telefono', '$rfc', '$correo', '$nombre_empresa', '$origen', '$destino', '$distancia', '$duracion', '$peajes', '$tipo_vehiculo', '$tipo_material', '$peso', '$fecha_salida', '$fecha_entrega', '$estatus', '$precio_total', '$id_usuario')";

if (mysqli_query($conn, $query)) {
    $response = ['status' => 'success', 'message' => 'Cotización guardada exitosamente'];
} else {
    $response = ['status' => 'error', 'message' => 'Error al guardar la cotización'];
}

echo json_encode($response);
mysqli_close($conn);
?>

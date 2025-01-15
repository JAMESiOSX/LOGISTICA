<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../CONEXION/conexion.php";

$rutaId = $_GET['rutaId'];
$camionId = $_GET['camionId'];
$peso = $_GET['peso'];
$costoGasolinaPorLitro = 25.50; // Precio por litro de gasolina

// Obtener los datos de la ruta
$rutaQuery = "SELECT * FROM rutas WHERE id='$rutaId'";
$rutaResult = $conn->query($rutaQuery);
$ruta = $rutaResult->fetch_assoc();

// Obtener los datos del camión
$camionQuery = "SELECT * FROM camiones WHERE id='$camionId'";
$camionResult = $conn->query($camionQuery);
$camion = $camionResult->fetch_assoc();

// Cálculo de los costos
$distancia = floatval($ruta['distancia']) * 2; // Ida y vuelta
$rendimiento = floatval($camion['rendimiento']);
$litrosNecesarios = $distancia / $rendimiento;
$costoCombustible = $litrosNecesarios * $costoGasolinaPorLitro;

$costoCasetas = floatval($ruta['costo_caseta']) * 2; // Ida y vuelta

// Costos adicionales (opcional)
$costoOperador = 150; // Por hora
$tiempoEstimado = floatval(str_replace(' horas', '', $ruta['tiempo_aproximado']));
$costoDesgaste = $distancia * 0.50; // Costo fijo por km

// Subtotal
$subtotal = $costoCombustible + $costoCasetas + ($costoOperador * $tiempoEstimado) + $costoDesgaste;

// Margen adicional del 10%
$total = $subtotal * 1.10;

$response = [
    'status' => 'success',
    'costo' => round($total, 2)
];

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../CONEXION/conexion.php";

$camionId = $_GET['camionId'];
$peso = $_GET['peso'];
$distancia = $_GET['distancia'];
$duracion = $_GET['duracion'];
$peajes = $_GET['peajes'];
$costoGasolinaPorLitro = 25.50; // Precio por litro de gasolina

// Obtener los datos del camión
$camionQuery = "SELECT * FROM camiones WHERE id='$camionId'";
$camionResult = $conn->query($camionQuery);
$camion = $camionResult->fetch_assoc();
$capacidadCarga = floatval($camion['capacidad_carga']) * 1000; // Capacidad de carga del camión en kilogramos

// Verificar si el peso ingresado excede la capacidad de carga del camión
if ($peso > $capacidadCarga) {
    $response = [
        'status' => 'error',
        'message' => 'El peso ingresado excede la capacidad de carga del camión seleccionado.'
    ];
    echo json_encode($response);
    exit;
}

// Cálculo de los costos
$rendimiento = floatval($camion['rendimiento']);

// Ajustar el rendimiento según el peso del material (bajo rendimiento si el camión está lleno o sobrecargado)
$ajusteRendimiento = $peso / $capacidadCarga;
if ($ajusteRendimiento > 1) {
    $ajusteRendimiento = 1.5; // Penalización
} else {
    $ajusteRendimiento = 1 + ($ajusteRendimiento * 0.5); // Ajuste proporcional
}
$rendimientoAjustado = $rendimiento / $ajusteRendimiento;

$litrosNecesarios = $distancia / $rendimientoAjustado;
$costoCombustible = $litrosNecesarios * $costoGasolinaPorLitro;

// Costos adicionales
$costoOperador = 250; // Por hora
$tiempoEstimado = floatval(str_replace(' horas', '', $duracion));
$costoDesgaste = $distancia * 0.50 * $ajusteRendimiento; // Costo fijo por km ajustado por peso

// Subtotal
$subtotal = $costoCombustible + floatval($peajes) + ($costoOperador * $tiempoEstimado) + $costoDesgaste;

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

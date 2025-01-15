<?php
$host = 'localhost';
$usuario = 'root';
$contrasena = 'hola123';
$base_de_datos = 'transporte_cotizaciones';
$puerto = 3306;

$conn = new mysqli($host, $usuario, $contrasena, $base_de_datos, $puerto);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Conexión fallida: " . $conn->connect_error]));
}
// No se imprime nada si la conexión es exitosa
?>

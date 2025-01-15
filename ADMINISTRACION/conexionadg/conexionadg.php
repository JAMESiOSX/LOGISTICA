<?php
// Datos de conexión
$servername = "localhost";
$username = "root";
$password = "hola123";
$dbname = "transporte_cotizaciones";
$port = 3306; // Puerto de MySQL

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Si la conexión es exitosa, puede continuar con el uso de la variable $conn para las consultas
?>

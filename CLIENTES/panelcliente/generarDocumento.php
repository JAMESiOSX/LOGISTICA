<?php
require_once "../CONEXION/conexion.php";

// Obtener el ID de la cotización desde la URL
$cotizacionId = $_GET['cotizacionId'];

// Obtener los datos de la cotización
$query = "SELECT * FROM contratos_clientes WHERE id='$cotizacionId'";
$result = $conn->query($query);
$cotizacion = $result->fetch_assoc();

// Generar el documento en HTML
$html = "
<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>Documento de Cotización - Transportes GARZAM</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { width: 80%; margin: auto; padding: 20px; border: 1px solid #333; border-radius: 10px; }
        .header { text-align: center; }
        .header img { width: 100px; }
        .header h1 { margin: 10px 0; }
        .content { margin-top: 20px; }
        .content p { line-height: 1.6; }
        .content p strong { font-size: 1.1em; }
        .footer { margin-top: 40px; text-align: center; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <img src='../iconos/logo.png' alt='Logo de Transportes GARZAM'>
            <h1>Documento de Cotización</h1>
        </div>
        <div class='content'>
            <p><strong>Nombre:</strong> {$cotizacion['nombre']} {$cotizacion['apellidos']}</p>
            <p><strong>Teléfono:</strong> {$cotizacion['telefono']}</p>
            <p><strong>RFC:</strong> {$cotizacion['rfc']}</p>
            <p><strong>Correo:</strong> {$cotizacion['correo']}</p>
            <p><strong>Nombre de la Empresa:</strong> {$cotizacion['nombre_empresa']}</p>
            <p><strong>Ruta:</strong> {$cotizacion['ruta']}</p>
            <p><strong>Camión:</strong> {$cotizacion['nombre_camion']}</p>
            <p><strong>Peso:</strong> {$cotizacion['peso']} toneladas</p>
            <p><strong>Material:</strong> {$cotizacion['tipo_material']}</p>
            <p><strong>Fecha de Salida:</strong> " . date("d/m/Y, h:i a", strtotime($cotizacion['fecha_salida'])) . "</p>
            <p><strong>Fecha de Entrega:</strong> " . date("d/m/Y, h:i a", strtotime($cotizacion['fecha_entrega'])) . "</p>
            <p><strong>Precio Total:</strong> {$cotizacion['precio_total']} pesos</p>
        </div>
        <div class='footer'>
            <p>Gracias por confiar en Transportes GARZAM. Estamos a su disposición para cualquier consulta adicional.</p>
        </div>
    </div>
</body>
</html>
";

// Imprimir el documento
echo $html;

// Cerrar la conexión
mysqli_close($conn);
?>

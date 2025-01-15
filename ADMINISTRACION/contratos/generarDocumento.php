<?php
require_once "../conexionadg/conexionadg.php";

// Obtener el ID del contrato desde la URL
$contratoId = $_GET['contratoId'];

// Obtener los datos del contrato
$query = "SELECT * FROM contratos_clientes WHERE id='$contratoId'";
$result = $conn->query($query);
$contrato = $result->fetch_assoc();

// Verificar si se encontró el contrato
if (!$contrato) {
    die("Contrato no encontrado.");
}

// Generar el documento en HTML
$html = "
<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>Documento de Contrato - Transportes GARZAM</title>
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
            <img src='../logo.png' alt='Logo de Transportes GARZAM'>
            <h1>Documento de Contrato</h1>
        </div>
        <div class='content'>
            <p><strong>Nombre:</strong> {$contrato['nombre']} {$contrato['apellidos']}</p>
            <p><strong>Teléfono:</strong> {$contrato['telefono']}</p>
            <p><strong>RFC:</strong> {$contrato['rfc']}</p>
            <p><strong>Correo:</strong> {$contrato['correo']}</p>
            <p><strong>Nombre de la Empresa:</strong> {$contrato['nombre_empresa']}</p>
            <p><strong>Ruta:</strong> {$contrato['ruta']}</p>
            <p><strong>Camión:</strong> {$contrato['nombre_camion']}</p>
            <p><strong>Peso:</strong> {$contrato['peso']} toneladas</p>
            <p><strong>Material:</strong> {$contrato['tipo_material']}</p>
            <p><strong>Fecha de Salida:</strong> " . date("d/m/Y, h:i a", strtotime($contrato['fecha_salida'])) . "</p>
            <p><strong>Fecha de Entrega:</strong> " . date("d/m/Y, h:i a", strtotime($contrato['fecha_entrega'])) . "</p>
            <p><strong>Precio Total:</strong> {$contrato['precio_total']} pesos</p>
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

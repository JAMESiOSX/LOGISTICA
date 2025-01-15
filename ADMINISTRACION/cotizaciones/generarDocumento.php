<?php
header("Content-Type: text/html; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "hola123";
$dbname = "transporte_cotizaciones";
$port = 3306;

$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$response = array();
try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $id = isset($_GET['id']) ? $conn->real_escape_string($_GET['id']) : '';
        $query = "SELECT * FROM cotizaciones_rapidas WHERE id = '$id'";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $cotizacion = $result->fetch_assoc();
            
            // Generar el HTML para el PDF
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
                        <img src='../logo.png' alt='Logo de Transportes GARZAM'>
                        <h1>Documento de Cotización</h1>
                    </div>
                    <div class='content'>
                        <p><strong>Nombre Completo:</strong> {$cotizacion['nombre_completo']}</p>
                        <p><strong>Correo:</strong> {$cotizacion['correo']}</p>
                        <p><strong>Teléfono:</strong> {$cotizacion['telefono']}</p>
                        <p><strong>Origen:</strong> {$cotizacion['origen']}</p>
                        <p><strong>Destino:</strong> {$cotizacion['destino']}</p>
                        <p><strong>Peso:</strong> {$cotizacion['peso']} kg</p>
                        <p><strong>Tipo de Mercancía:</strong> {$cotizacion['tipo_mercancia']}</p>
                        <p><strong>Fecha de Salida:</strong> " . date("d/m/Y, h:i a", strtotime($cotizacion['fecha_salida'])) . "</p>
                        <p><strong>Fecha de Entrega:</strong> " . date("d/m/Y, h:i a", strtotime($cotizacion['fecha_entrega'])) . "</p>
                        <p><strong>Costo:</strong> {$cotizacion['costo']} pesos</p>
                        <p><strong>Estatus:</strong> {$cotizacion['estatus']}</p>
                        <p><strong>Fecha de Creación:</strong> " . date("d/m/Y, h:i a", strtotime($cotizacion['fecha_creacion'])) . "</p>
                    </div>
                    <div class='footer'>
                        <p>Gracias por confiar en Transportes GARZAM. Estamos a su disposición para cualquier consulta adicional.</p>
                    </div>
                </div>
            </body>
            </html>
            ";

            // Guardar el HTML en un archivo
            file_put_contents('generarDocumento.html', $html);

            $response = ['status' => 'success', 'message' => 'PDF generado correctamente.', 'html' => $html];
        } else {
            throw new Exception("Cotización no encontrada.");
        }
    } else {
        throw new Exception("Método no permitido.");
    }
} catch (Exception $e) {
    error_log("Error en generarDocumento.php: " . $e->getMessage());
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);

// Cerrar la conexión
mysqli_close($conn);
?>

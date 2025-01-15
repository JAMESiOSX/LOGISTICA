<?php
require_once "../conexionadg/conexionadg.php";

// Obtener el ID de la cotización desde la URL
$cotizacionId = $_GET['cotizacionId'];

// Obtener los datos de la cotización
$query = "SELECT * FROM contratos_clientes_maps WHERE id='$cotizacionId'";
$result = $conn->query($query);
$cotizacion = $result->fetch_assoc();

// Verificar si se encontró la cotización
if (!$cotizacion) {
    die("Cotización no encontrada.");
}

// Coordenadas del origen y destino
$origen = $cotizacion['origen'];
$destino = $cotizacion['destino'];

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
        #map { height: 200px; width: 100%; margin-top: 20px; } /* Reducir el tamaño del mapa */
    </style>
    <script>
        function initMap() {
            var directionsService = new google.maps.DirectionsService();
            var directionsRenderer = new google.maps.DirectionsRenderer();
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: {lat: 19.4326, lng: -99.1332} // Coordenadas centrales, puedes ajustarlas
            });
            directionsRenderer.setMap(map);

            var request = {
                origin: '$origen',
                destination: '$destino',
                travelMode: 'DRIVING'
            };
            directionsService.route(request, function(result, status) {
                if (status == 'OK') {
                    directionsRenderer.setDirections(result);
                }
            });
        }
    </script>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <img src='../logo.png' alt='Logo de Transportes GARZAM'>
            <h1>Documento de Cotización</h1>
        </div>
        <div class='content'>
            <p><strong>Nombre:</strong> {$cotizacion['nombre']} {$cotizacion['apellidos']}</p>
            <p><strong>Teléfono:</strong> {$cotizacion['telefono']}</p>
            <p><strong>RFC:</strong> {$cotizacion['rfc']}</p>
            <p><strong>Correo:</strong> {$cotizacion['correo']}</p>
            <p><strong>Nombre de la Empresa:</strong> {$cotizacion['nombre_empresa']}</p>
            <p><strong>Origen:</strong> {$cotizacion['origen']}</p>
            <p><strong>Destino:</strong> {$cotizacion['destino']}</p>
            <p><strong>Distancia:</strong> {$cotizacion['distancia']} km</p>
            <p><strong>Duración:</strong> {$cotizacion['duracion']}</p>
            <p><strong>Peajes:</strong> {$cotizacion['peajes']} pesos</p>
            <p><strong>Tipo de Vehículo:</strong> {$cotizacion['tipo_vehiculo']}</p>
            <p><strong>Material:</strong> {$cotizacion['tipo_material']}</p>
            <p><strong>Peso:</strong> {$cotizacion['peso']} toneladas</p>
            <p><strong>Fecha de Salida:</strong> " . date("d/m/Y, h:i a", strtotime($cotizacion['fecha_salida'])) . "</p>
            <p><strong>Fecha de Entrega:</strong> " . date("d/m/Y, h:i a", strtotime($cotizacion['fecha_entrega'])) . "</p>
            <p><strong>Precio Total:</strong> {$cotizacion['precio_total']} pesos</p>
        </div>
        <div id='map'></div>
        <div class='footer'>
            <p>Gracias por confiar en Transportes GARZAM. Estamos a su disposición para cualquier consulta adicional.</p>
        </div>
    </div>
    <script async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBTkG8LoFhhx3RnSHg04j22GgL2-sYNwq0&callback=initMap'></script>
</body>
</html>
";

// Imprimir el documento
echo $html;

// Cerrar la conexión
mysqli_close($conn);
?>

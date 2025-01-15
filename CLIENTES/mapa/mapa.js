let map;
let directionsService;
let directionsRenderers = [];
let selectedRouteIndex = null; // Variable para almacenar la ruta seleccionada

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
    });

    directionsService = new google.maps.DirectionsService();

    // Autocompletado
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");
    new google.maps.places.Autocomplete(startInput);
    new google.maps.places.Autocomplete(endInput);

    // Geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, () => {
            handleLocationError(true, map.getCenter());
        });
    } else {
        handleLocationError(false, map.getCenter());
    }
}

async function calculateRoute() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    // Geocodificar las direcciones para obtener las coordenadas
    const geocoder = new google.maps.Geocoder();

    try {
        const originResponse = await geocoder.geocode({ address: start });
        const destinationResponse = await geocoder.geocode({ address: end });

        if (originResponse.results.length > 0 && destinationResponse.results.length > 0) {
            const origin = originResponse.results[0].geometry.location;
            const destination = destinationResponse.results[0].geometry.location;

            // Obtener datos de rutas y peajes usando DirectionsService
            const directionsRequest = {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true // Permitir rutas alternativas
            };

            directionsService.route(directionsRequest, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    // Limpiar renderers anteriores
                    directionsRenderers.forEach(renderer => renderer.setMap(null));
                    directionsRenderers = [];

                    // Crear un nuevo renderer para cada ruta
                    result.routes.forEach((route, index) => {
                        const renderer = new google.maps.DirectionsRenderer({
                            map: map,
                            directions: result,
                            routeIndex: index,
                            polylineOptions: {
                                strokeColor: getRandomStrongColor(),
                                strokeOpacity: 1.0,
                                strokeWeight: 6
                            }
                        });
                        directionsRenderers.push(renderer);
                    });

                    // Obtener distancia y duración de las rutas
                    const routes = result.routes;
                    displayRoutes(routes);

                    // Obtener peajes de la API de Routes
                    fetchTollInfo(routes, origin, destination);
                } else {
                    alert('No se pudo calcular la ruta: ' + status);
                }
            });

        } else {
            alert("No se pudieron geocodificar las direcciones.");
        }
    } catch (error) {
        alert("No se pudo calcular la ruta: " + error.message);
    }
}

function displayRoutes(routes) {
    let output = '';

    routes.forEach((route, index) => {
        const leg = route.legs[0];
        const distance = leg.distance ? leg.distance.text : 'No disponible';
        const duration = leg.duration ? leg.duration.text : 'No disponible';
        const routeSummary = route.summary || `Ruta ${index + 1}`;

        output += `
            <div class="card">
                <p><strong>${routeSummary}:</strong></p>
                <p><strong>Distancia:</strong> ${distance}</p>
                <p><strong>Duración:</strong> ${duration}</p>
                <p><strong>Peajes:</strong> <span id="tolls-${index}">No existen peajes</span></p>
                <button onclick="selectRoute(${index})">Seleccionar Ruta</button>
            </div>
        `;
    });

    document.getElementById('output').innerHTML = output;
}

async function fetchTollInfo(routes, origin, destination) {
    try {
        const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': 'AIzaSyBTkG8LoFhhx3RnSHg04j22GgL2-sYNwq0',
                'X-Goog-FieldMask': 'routes.legs.travelAdvisory.tollInfo'
            },
            body: JSON.stringify({
                origin: {
                    location: {
                        latLng: {
                            latitude: origin.lat(),
                            longitude: origin.lng()
                        }
                    }
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: destination.lat(),
                            longitude: destination.lng()
                        }
                    }
                },
                travelMode: "DRIVE",
                extraComputations: ["TOLLS"],
                routeModifiers: {
                    vehicleInfo: {
                        emissionType: "GASOLINE"
                    },
                    tollPasses: ["US_CA_Fastrak"] // Ajusta según los pases de peaje que tienes
                }
            })
        });

        const data = await response.json();

        if (response.ok && data.routes && data.routes.length > 0) {
            data.routes.forEach((route, index) => {
                const leg = route.legs[0];
                const tollInfo = leg.travelAdvisory?.tollInfo;
                const tolls = tollInfo ? formatTollInfo(tollInfo) : 'No disponible';
                document.getElementById(`tolls-${index}`).textContent = tolls;
            });
        } else {
            alert("No se pudo calcular la ruta: " + (data.error?.message || 'No se encontraron rutas.'));
        }
    } catch (error) {
        alert("No se pudo calcular la ruta: " + error.message);
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    const infoWindow = new google.maps.InfoWindow;
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: El servicio de geolocalización falló.' :
        'Error: Tu navegador no soporta geolocalización.');
    infoWindow.open(map);
}

function formatTollInfo(tollInfo) {
    return tollInfo.estimatedPrice.map(price => `${price.currencyCode} ${price.units}.${Math.floor(price.nanos / 1e7)}`).join(', ');
}

function getRandomStrongColor() {
    const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF', '#00FFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function selectRoute(index) {
    selectedRouteIndex = index;

    // Remover renderers de todas las rutas excepto la seleccionada
    directionsRenderers.forEach((renderer, idx) => {
        if (idx !== index) {
            renderer.setMap(null);
        }
    });

    // Mostrar solo la ruta seleccionada
    directionsRenderers[index].setMap(map);

    // Actualizar la interfaz para mostrar solo la ruta seleccionada
    const selectedRouteElement = document.querySelectorAll('.card')[index].outerHTML;
    document.getElementById('output').innerHTML = selectedRouteElement;

    // Agregar botón para confirmar la ruta seleccionada
    document.getElementById('output').innerHTML += `
        <button onclick="confirmRoute()">Confirmar Ruta Seleccionada</button>
        <button onclick="resetRoutes()">Seleccionar Otra Ruta</button>
    `;
}

function confirmRoute() {
    const route = directionsRenderers[selectedRouteIndex].directions.routes[selectedRouteIndex];
    const leg = route.legs[0];
    const routeSummary = route.summary || `Ruta ${selectedRouteIndex + 1}`;
    const distance = leg.distance ? leg.distance.text : 'No disponible';
    const duration = leg.duration ? leg.duration.text : 'No disponible';
    const tolls = document.getElementById(`tolls-${selectedRouteIndex}`).textContent;

    // Mostrar confirmación con detalles de la ruta
    document.getElementById('selected-route-details').innerHTML = `
        <h3>Ruta Seleccionada:</h3>
        <p><strong>Nombre de la Ruta:</strong> ${routeSummary}</p>
        <p><strong>Distancia:</strong> ${distance}</p>
        <p><strong>Duración:</strong> ${duration}</p>
        <p><strong>Peajes:</strong> ${tolls}</p>
        <img src="paloma.png" alt="Ruta Confirmada" width="30" height="30">
    `;
}

function resetRoutes() {
    // Limpiar la selección actual y mostrar todas las rutas nuevamente
    selectedRouteIndex = null;
    directionsRenderers.forEach(renderer => renderer.setMap(map));
    displayRoutes(directionsRenderers[0].directions.routes);

    // Limpiar detalles de la ruta seleccionada
    document.getElementById('selected-route-details').innerHTML = '';
}

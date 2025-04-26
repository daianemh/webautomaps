let map;
let service;
let infowindow;
let userLocation;

function initMap() {
    // Fallback para caso a geolocalização falhe
    const defaultLocation = { lat: -23.533773, lng: -46.625290 }; // São Paulo
    
    // Configuração inicial do mapa
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 13
    });

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    // Tenta geolocalização do usuário
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
                searchAutomotiveServices(userLocation);
            },
            () => {
                handleLocationError(true, defaultLocation);
            }
        );
    } else {
        handleLocationError(false, defaultLocation);
    }

    // Adiciona evento ao botão
    document.getElementById('searchBtn').addEventListener('click', searchServices);
}

function handleLocationError(browserHasGeolocation, pos) {
    console.log(browserHasGeolocation ?
        "Usuário negou geolocalização" :
        "Navegador não suporta geolocalização");
    map.setCenter(pos);
    searchAutomotiveServices(pos);
}

function searchServices() {
    const input = document.getElementById('searchInput').value;
    
    if (!input) {
        alert("Digite uma localização");
        return;
    }

    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: input }, (results, status) => {
        if (status === "OK" && results[0]) {
            map.setCenter(results[0].geometry.location);
            searchAutomotiveServices(results[0].geometry.location);
        } else {
            alert("Localização não encontrada: " + status);
            console.error("Geocoding error:", status);
        }
    });
}

function searchAutomotiveServices(location) {
    const request = {
        location: location,
        radius: '2000',
        type: ['car_repair', 'car_wash', 'gas_station'],
        fields: ['name', 'geometry', 'formatted_address', 'rating', 'website']
    };

    service.nearbySearch(request, (results, status) => {
        const resultsContainer = document.getElementById('results');
        
        if (status !== "OK") {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    Nenhum serviço encontrado (${status}).<br>
                    Tente ampliar a área de busca.
                </div>
            `;
            console.error("Places API error:", status);
            return;
        }

        displayResults(results);
        createMarkers(results);
    });
}

function createMarkers(places) {
    // Limpa marcadores anteriores
    const markers = [];
    
    places.forEach(place => {
        if (!place.geometry || !place.geometry.location) return;

        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name
        });

        markers.push(marker);

        marker.addListener('click', () => {
            const content = `
                <div class="info-window">
                    <h3>${place.name}</h3>
                    <p>${place.formatted_address || 'Endereço não disponível'}</p>
                    ${place.rating ? `<p>⭐ ${place.rating}/5</p>` : ''}
                    ${place.website ? `<a href="${place.website}" target="_blank">Site</a>` : ''}
                </div>
            `;
            infowindow.setContent(content);
            infowindow.open(map, marker);
        });
    });
}

function displayResults(places) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <h3>${place.name}</h3>
            <p>${place.formatted_address}</p>
            ${place.rating ? `<p>Classificação: ${place.rating}/5</p>` : ''}
            <button onclick="showOnMap(${place.geometry.location.lat()}, ${place.geometry.location.lng()})">
                Ver no Mapa
            </button>
        `;
        resultsContainer.appendChild(card);
    });
}

window.showOnMap = (lat, lng) => {
    map.setCenter({ lat, lng });
    map.setZoom(16);
};

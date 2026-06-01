let map;
let service;
let infowindow;
let userLocation;
let currentMarkers = []; // Armazena marcadores para limpeza correta

async function initMap() {
    const defaultLocation = { lat: -23.533773, lng: -46.625290 }; // São Paulo
    
    // Importa a biblioteca de marcadores avançados por segurança e performance
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 13,
        mapId: "DEMO_MAP_ID" // Necessário para AdvancedMarkerElement. Substitua pelo seu Map ID real.
    });

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

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

    document.getElementById('searchBtn').addEventListener('click', searchServices);
}

function handleLocationError(browserHasGeolocation, pos) {
    console.warn(browserHasGeolocation ?
        "Usuário negou geolocalização ou timeout." :
        "Navegador não suporta geolocalização.");
    map.setCenter(pos);
    searchAutomotiveServices(pos);
}

function searchServices() {
    const input = document.getElementById('searchInput').value.trim();
    
    if (!input) {
        alert("Por favor, digite uma localização válida.");
        return;
    }

    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: input }, (results, status) => {
        if (status === "OK" && results[0]) {
            map.setCenter(results[0].geometry.location);
            searchAutomotiveServices(results[0].geometry.location);
        } else {
            alert("Localização não encontrada.");
            console.error("Geocoding error:", status);
        }
    });
}

function searchAutomotiveServices(location) {
    const request = {
        location: location,
        radius: 2000,
        type: ['car_repair', 'car_wash', 'gas_station']
    };

    service.nearbySearch(request, (results, status) => {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Limpeza segura de container de texto genérico

        if (status !== "OK") {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = `Nenhum serviço encontrado ou erro na busca (${status}).`;
            resultsContainer.appendChild(errorDiv);
            return;
        }

        displayResults(results);
        createMarkers(results);
    });
}

function createMarkers(places) {
    // Limpa marcadores anteriores do mapa de forma segura
    currentMarkers.forEach(marker => marker.setMap(null));
    currentMarkers = [];
    
    places.forEach(place => {
        if (!place.geometry || !place.geometry.location) return;

        // Uso do AdvancedMarkerElement padrão do Google Maps
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: place.geometry.location,
            title: place.name
        });

        currentMarkers.push(marker);

        marker.addListener('click', () => {
            // Defesa contra XSS: Construindo os elementos InfoWindow via DOM, nunca injetando strings puras
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info-window';

            const title = document.createElement('h3');
            title.textContent = place.name; // Escapa automaticamente caracteres maliciosos
            infoDiv.appendChild(title);

            const address = document.createElement('p');
            address.textContent = place.vicinity || 'Endereço não disponível';
            infoDiv.appendChild(address);

            if (place.rating) {
                const rating = document.createElement('p');
                rating.textContent = `⭐ ${place.rating}/5`;
                infoDiv.appendChild(rating);
            }

            infowindow.setContent(infoDiv);
            infowindow.open(map, marker);
        });
    });
}

function displayResults(places) {
    const resultsContainer = document.getElementById('results');

    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'service-card';

        const title = document.createElement('h3');
        title.textContent = place.name;
        card.appendChild(title);

        const address = document.createElement('p');
        address.textContent = place.vicinity || 'Endereço não especificado';
        card.appendChild(address);

        if (place.rating) {
            const rating = document.createElement('p');
            rating.textContent = `Classificação: ${place.rating}/5`;
            card.appendChild(rating);
        }

        const button = document.createElement('button');
        button.textContent = 'Ver no Mapa';
        
        // Evita manipulação inline invasiva de escopo (Segurança de Eventos)
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        button.addEventListener('click', () => {
            map.setCenter({ lat, lng });
            map.setZoom(16);
        });
        
        card.appendChild(button);
        resultsContainer.appendChild(card);
    });
}

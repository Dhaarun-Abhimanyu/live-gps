function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: 11.0168, lng: 76.9558 },
        styles: [
            {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#000000" }],
            },
        ],
    });

    // Socket.io connection with the correct server address
    const socket = io('http://localhost:8080');

    // Create a marker for the client
    const clientMarker = new google.maps.Marker({
        position: { lat: 11.0168, lng: 76.9558 },
        map: map,
        title: "You are here",
    });

    // Socket.io listener for updated locations from the server
    socket.on('updatedLocation', (location) => {
        // Update the position of the client marker
        clientMarker.setPosition(location);
    });

    // Socket.io listener for initial location from the server
    socket.on('initialLocation', (location) => {
        // Update the position of the client marker initially
        clientMarker.setPosition(location);
    });

    // Continuously update the server with the client's location
    navigator.geolocation.watchPosition(
        (position) => {
            const updatedClientLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            // Update the position of the client marker
            clientMarker.setPosition(updatedClientLocation);

            // Emit the updated location to the server
            socket.emit('updateLocation', updatedClientLocation);
        },
        (error) => {
            console.error("Error getting client's location:", error);
        }
    );
}

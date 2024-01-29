document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://172.16.12.231'); // Use your local IP here

    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
    });

    let userMarker;

    // Ask the user for location permission
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Center the map on the user's location
                map.setCenter(userLocation);
                map.setZoom(15);

                // Display a pin on the map at the user's location
                userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Your Location',
                });

                // Emit the user's initial location to the server
                socket.emit('updateLocation', userLocation);
            },
            (error) => {
                console.error('Error getting user location:', error);

                // Handle geolocation errors here
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');

        // Handle geolocation not supported
    }

    // Listen for location updates from the server
    socket.on('updatedLocation', (location) => {
        if (userMarker) {
            userMarker.setPosition(location);
        } else {
            userMarker = new google.maps.Marker({
                position: location,
                map: map,
                title: 'Your Location',
            });
        }
    });
});

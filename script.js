document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://172.16.12.231'); // Use your local IP here

    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 15,
    });

    let userMarker;
    let trailPolyline;

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
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }

    // Listen for location updates from the server
    socket.on('updatedLocation', (location) => {
        updateLocation(location);
    });

    function updateLocation(newLocation) {
        if (userMarker) {
            // Move the user marker to the new location
            userMarker.setPosition(newLocation);
        } else {
            // Create a new marker for the user
            userMarker = new google.maps.Marker({
                position: newLocation,
                map: map,
                title: 'Your Location',
            });
        }

        // Update the trail polyline
        updateTrail(newLocation);
    }

    function updateTrail(newLocation) {
        if (!trailPolyline) {
            // Create a new polyline for the trail
            trailPolyline = new google.maps.Polyline({
                map: map,
                path: [newLocation],
                geodesic: true,
                strokeColor: '#FF0000', // Red color
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });
        } else {
            // Extend the path of the existing polyline
            const path = trailPolyline.getPath();
            path.push(newLocation);
            trailPolyline.setPath(path);
        }
    }
});

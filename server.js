const httpServer = require('http-server');
const server = httpServer.createServer({ root: './public' });

const socketIO = require('socket.io');
const io = socketIO(server);

// Socket.io connection
io.on('connection', (socket) => {
    console.log('Client connected');

    // Emit the initial location to the server when a new client connects
    socket.emit('initialLocationRequest');

    // Listen for location updates from the client
    socket.on('updateLocation', (location) => {
        console.log('Updated location:', location);

        // Broadcast the updated location to all connected clients
        io.emit('updatedLocation', location);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server on port 8080
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

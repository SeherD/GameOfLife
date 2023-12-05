import io from 'socket.io-client';

// set up socket.io socket used to connect to the server
const socket = io('http://localhost:5000');

export default socket;
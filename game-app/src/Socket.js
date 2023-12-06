import io from 'socket.io-client';

const socket = io('http://localhost:5000/');
let playerID;
let socketPlayerIndex;



socket.on('player_id', data => {
    playerID = data.player_id;
    console.log(`Received player ID: ${playerID}`);
    let number = parseInt(playerID.substring(1));
    socketPlayerIndex = (number - 1).toString();
    console.log(socketPlayerIndex);
});

export { socket, socketPlayerIndex };  // Export the username

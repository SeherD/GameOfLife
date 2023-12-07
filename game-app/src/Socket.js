import io from 'socket.io-client';

const socket = io('http://localhost:5000/');
let playerID;
let username;
let socketPlayerIndex;
let socketUsername;



socket.on('player_id', data => {
    playerID = data.player_id;
    username=data.username;
    console.log(`Received player ID: ${playerID}`);
    console.log(`Received player username: ${username}`);
    let number = parseInt(playerID.substring(1));
    socketPlayerIndex = (number - 1).toString();
    console.log(socketPlayerIndex);
    socketUsername=username;
});

export { socket, socketPlayerIndex, socketUsername };  // Export the username

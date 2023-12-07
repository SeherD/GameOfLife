import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlayerIcon from '../Components/PlayerIcon';
import { socket, socketPlayerIndex, socketUsername } from '../Socket';
import avatar5 from '../assets/Avatars/Avatar5.png';
import avatar1 from '../assets/Avatars/Avatar1.png';
import avatar2 from '../assets/Avatars/Avatar2.png';
import avatar3 from '../assets/Avatars/Avatar3.png';
import avatar4 from '../assets/Avatars/Avatar4.png';

function LobbyPage() {
  const navigate = useNavigate();
  const [host, setHost] = useState(parseInt(socketPlayerIndex, 10) === 0);
  const [players, setPlayers] = useState([
    { avatar: avatar1, hasConnected: true },
    { avatar: avatar2, hasConnected: false },
    { avatar: avatar3, hasConnected: false },
    { avatar: avatar4, hasConnected: false },
    { avatar: avatar5, hasConnected: false },
  ]);

  const handleStartGame = () => {
    // Emit a socket event to notify other players to navigate to "/game"
    socket.emit('startGame');
  };

  const initializePlayers = () => {
    setPlayers((prevPlayers) => {
    const initialPlayers = [...prevPlayers];
    for (let i = 0; i <= parseInt(socketPlayerIndex, 10); i++) {
      initialPlayers[i].hasConnected= true ;
    }
    return initialPlayers;
  });
  };


  useEffect(() => {
    // Emit a socket event to notify the server that the host is in the lobby
    if (host) {
      socket.emit('hostInLobby');
    }

    // Listen for the "startGame" event and navigate to "/game" when it's received
    const handleStartGameEvent = () => {
      navigate('/game');
    };

    socket.on('switch_game', handleStartGameEvent);

    // Listen for the "updatePlayers" event and update the players array
    const handleUpdatePlayersEvent = (numConnectedPlayers) => {
      setPlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers];
        for (let i = 0; i < numConnectedPlayers; i++) {
          if (updatedPlayers[i]) {
            // Update the hasConnected status for the player
            updatedPlayers[i].hasConnected = true;
          } else {
            // Create a new player entry if it doesn't exist
            updatedPlayers[i] = { avatar: `avatar${i + 1}`, hasConnected: true };
          }
        }
        console.log(updatedPlayers);
        return updatedPlayers;
      });
    };
    
    // Assuming the server emits the number of connected players like this:
    // socket.emit('updatePlayers', numConnectedPlayers);
    

    socket.on('updatePlayers', handleUpdatePlayersEvent);


    initializePlayers();
    // Clean up the event listeners when the component unmounts
    return () => {
      socket.off('switch_game', handleStartGameEvent);
      socket.off('updatePlayers', handleUpdatePlayersEvent);
    };
  }, [host, navigate]);

  const playerIconsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const centeredPlayerIconStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  };

  return (
    <div className="LobbyPage">
      <div>
        <h1>THE GAME OF LIFE <br/> SOFTWARE DEVELOPER EDITION</h1>
        <hr/>
      </div>
      <div>
        {host ?
          <h3>Ready to Start</h3> :
          <h3>Waiting for host to start game...</h3>
        }
      </div>
      <div style={playerIconsContainerStyle}>
        <PlayerIcon
          key={0}
          image={players[0].avatar}
          host={host && 0 === 0}
          joined={players[0].hasConnected}
        />
        <div style={centeredPlayerIconStyle}>
          <PlayerIcon
            key={1}
            image={players[1].avatar}
            host={false}
            joined={players[1].hasConnected}
          />
        </div>
        <PlayerIcon
          key={2}
          image={players[2].avatar}
          host={host && 2 === 0}
          joined={players[2].hasConnected}
        />
        <PlayerIcon
          key={3}
          image={players[3].avatar}
          host={host && 3 === 0}
          joined={players[3].hasConnected}
        />
        <PlayerIcon
          key={4}
          image={players[4].avatar}
          host={host && 4 === 0}
          joined={players[4].hasConnected}
        />
      </div>
      <div>
        {host ? <div className="landingPageButton" onClick={handleStartGame}><Link to="/game">START GAME</Link></div> : <div/> }
      </div>
    </div>
  );
}

export default LobbyPage;
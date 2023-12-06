import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlayerIcon from '../Components/PlayerIcon';
import avatar5 from '../assets/Avatars/Avatar5.png';
import avatar1 from '../assets/Avatars/Avatar1.png';
import avatar2 from '../assets/Avatars/Avatar2.png';
import avatar3 from '../assets/Avatars/Avatar3.png';
import avatar4 from '../assets/Avatars/Avatar4.png';
import { socket, socketPlayerIndex, socketUsername } from '../Socket';

function LobbyPage() {
  const navigate = useNavigate();
  const [host, setHost] = useState(parseInt(socketPlayerIndex, 10) === 0);

  const handleStartGame = () => {
    // Emit a socket event to notify other players to navigate to "/game"
    socket.emit('startGame');
  };

  useEffect(() => {
    // Listen for the "startGame" event and navigate to "/game" when it's received
    const handleStartGameEvent = () => {
      navigate('/game');
    };

    socket.on('switch_game', handleStartGameEvent);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('switch_game', handleStartGameEvent);
    };
  }, [navigate]);

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
      <div>
        <PlayerIcon image={avatar1} host={true} joined={true} />
      </div>
      <div className="playerIconDiv">
        <PlayerIcon image={avatar2} host={false} joined={true} />
        <PlayerIcon image={avatar3} host={false} joined={true} />
      </div>
      <div className="playerIconDiv">
        <PlayerIcon image={avatar4} host={false} joined={true} />
        <PlayerIcon image={avatar5} host={false} joined={false} />
      </div>
      <div>
        {host ? <div className="landingPageButton" onClick={handleStartGame}><Link to="/game">START GAME</Link></div> : <div/> }
      </div>
    </div>
  );
}

export default LobbyPage;

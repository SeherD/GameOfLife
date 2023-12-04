import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import PlayerIcon from '../Components/PlayerIcon';
import avatar5 from '../assets/avatar5.jpg';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.jpg';
import avatar3 from '../assets/avatar3.jpg';
import avatar4 from '../assets/avatar4.jpg';

function LobbyPage() {
    // TODO: call a flask endpoint to find out if the current player is the host
    // eslint-disable-next-line
    const [host, setHost] = useState(true);
    // TODO: call a flask endpoint to get the current game ID
    // eslint-disable-next-line
    const [gameID, setGameID] = useState();

  return (
    <div className="LobbyPage">
      <div>
        <h1>THE GAME OF LIFE <br/> SOFTWARE DEVELOPER EDITION</h1>
        <div id='gameCode'>Game code: {gameID}</div>
        <hr/>
      </div>
      <div>
        {host ?
            <h3>Ready to Start</h3> :
            <h3>Waiting for host to start game...</h3>
        }
      </div>
      <div>
        <PlayerIcon image= {avatar1}
            host = {true}
            joined = {true}
        />
      </div>
      <div className="playerIconDiv">
        <PlayerIcon image= {avatar2}
            host = {false}
            joined = {true}
        />
        <PlayerIcon image= {avatar3}
            host = {false}
            joined = {true}
        />
      </div>
      <div className="playerIconDiv">
        <PlayerIcon image= {avatar4}
            host = {false}
            joined = {true}
        />
        <PlayerIcon image= {avatar5}
            host = {false}
            joined = {false}
        />
      </div>
    <div>
          {/* TODO: Call a flask endpoint to find out if the current player is the host */}
          {host ? <div className="landingPageButton"><Link to="/game">START GAME</Link></div> : <div/> }
    </div>
    </div>
  );
}

export default LobbyPage;
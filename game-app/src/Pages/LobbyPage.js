import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import PlayerIcon from '../Components/PlayerIcon';
import avatar5 from '../assets/Avatars/Avatar5.png';
import avatar1 from '../assets/Avatars/Avatar1.png';
import avatar2 from '../assets/Avatars/Avatar2.png';
import avatar3 from '../assets/Avatars/Avatar3.png';
import avatar4 from '../assets/Avatars/Avatar4.png';

function LobbyPage() {

    const [host, setHost] = useState(true);

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
          {host ? <div className="landingPageButton"><Link to="/game">START GAME</Link></div> : <div/> }
    </div>
    </div>
  );
}

export default LobbyPage;

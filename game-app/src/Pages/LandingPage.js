import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import PlayerIcon from '../Components/PlayerIcon';
import avatar5 from '../assets/avatar5.jpg';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.jpg';
import avatar3 from '../assets/avatar3.jpg';
import avatar4 from '../assets/avatar4.jpg';

function LandingPage() {
    const [waiting, setWaiting] = useState(false);

  return (
    <div className="LandingPage">
      <div>
        <h1>THE GAME OF LIFE <br/> SOFTWARE DEVELOPER EDITION</h1>
        <hr/>
      </div>
      <div>
        {waiting ?
            <h3>Waiting for players to join...</h3> :
            <h3>Ready to Start</h3>}
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
        {waiting ? <div/>: <div className="startButton"><Link to="/game">START GAME</Link></div>}
    </div>
    </div>
  );
}

export default LandingPage;

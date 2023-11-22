import React, { useState } from 'react';
import './App.css';
import GameBoard from './Container/GameBoard';
import PlayerInfo from './Components/PlayerInfo';
import avatar from './assets/avatar1.png';

function App() {
  const [playerInfo, setPlayerInfo] = useState({
    image: avatar,
    career: "Barista",
    balance: 0,
    languages: [],
    houses: [],
    color: "pink"
  });

  const updatePlayerInfo = (newPlayerInfo) => {
    setPlayerInfo(newPlayerInfo);
  };

  return (
    <div className="App">
      <header className="App-header">
      {/*TODO: Get player info from database and pass as props */}
        <PlayerInfo {...playerInfo} />
        <GameBoard playerInfo={playerInfo} updatePlayerInfo={updatePlayerInfo} />
      </header>
    </div>
  );
}

export default App;

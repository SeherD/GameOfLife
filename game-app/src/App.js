import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LobbyPage from './Pages/LobbyPage';
import GamePage from './Pages/GamePage';
import SigninPage from './Pages/SigninPage';

function App() {

  return (
    <div className="App">
    <header className="App-header">
    <PlayerProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/" element = {<SigninPage/>}/>
      <Route path="lobby" element = {<LobbyPage/>}/>
      <Route path="game" element ={<GamePage/>}/>
    </Routes>
    </BrowserRouter>
    </PlayerProvider>
    </header>
    </div>
  );
}

export default App;

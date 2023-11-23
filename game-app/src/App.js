import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './Pages/LandingPage';
import GamePage from './Pages/GamePage';

function App() {

  return (
    <div className="App">
    <header className="App-header">
    <BrowserRouter>
    <Routes>
      <Route path="/" element = {<LandingPage/>}/>
      <Route path="game" element ={<GamePage/>}/>
    </Routes>
    </BrowserRouter>
    </header>
    </div>
  );
}

export default App;

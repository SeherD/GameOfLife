import './App.css';
import GameBoard from './Container/GameBoard';
import PlayerInfo from './Components/PlayerInfo';
import avatar from './assets/avatar1.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      {/*TODO: Get player info from database and pass as props */}
        <PlayerInfo
          image={avatar}
          career="Startup CEO"
          cash="-100,000"
          languages={["Java", "Python"]}
          houses="Parent's Basement"
          color="pink"
        />
        <GameBoard/>  
      </header>
    </div>
  );
}

export default App;

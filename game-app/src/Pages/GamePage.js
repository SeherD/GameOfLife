import React, {Component} from 'react';
import GameBoard from '../Components/GameBoard';
import PlayerInfo from '../Components/PlayerInfo';
import avatar from '../assets/avatar1.png';
import axios from 'axios';

export default class GamePage extends Component {
  state = {
    playerInfo:{
      image: 'Avatar1.png',
      career: "",
      cash: 200000,
      salary: null,
      languages: [],
      houses: [],
      color: "pink"
  }};

  componentDidMount() {
    axios({
        method: "GET",
        url:"/players/P1"
      })
      .then((response) => {
        this.setState({playerInfo: response.data});

      })
}

  updatePlayerInfo = (playerId) => {
    axios({
      method: "GET",
      url:"/players/P" + playerId
    })
    .then((response) => {
      console.log(response.data)
      this.setState({playerInfo: response.data});

    })
  };

  render() {return (
    <div className="GamePage">
      <header>
        <PlayerInfo playerInfo = {this.state.playerInfo}/>
        <GameBoard playerInfo={this.state.playerInfo} updatePlayerInfo={this.updatePlayerInfo} />
      </header>
    </div>
  );}
}


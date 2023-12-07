import React, {Component} from 'react';
import GameBoard from '../Components/GameBoard';
import PlayerInfo from '../Components/PlayerInfo';
import axios from 'axios';
import {socket, socketPlayerIndex, socketUsername} from '../Socket'

let socketIndex= parseInt(socketPlayerIndex)+1;
export default class GamePage extends Component {
  state = {
    playerInfo:{
      image: `Avatar${socketIndex}.png`,
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


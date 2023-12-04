import React, {Component} from 'react'

export default class PlayerInfo extends Component {


render(){
        return(
            <div className = "playerInfo" style={{backgroundColor: this.props.playerInfo.color}}>
            <img className="avatar" src={this.props.image} alt="player avatar"></img>
            <h3>Player Assets</h3>
            <p>Career: {this.props.playerInfo.career}</p>
            <p>Salary: ${this.props.playerInfo.salary}</p>
            <p>Cash: ${this.props.playerInfo.cash}</p>
            <p>Programming Languages: {this.props.playerInfo.languages.join(', ')}</p>
            <p>Houses: {this.props.playerInfo.houses.join(', ')}</p>
            </div>
        )
    }

}
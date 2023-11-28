import React, {Component} from 'react'

export default class PlayerInfo extends Component {


render(){
        return(
            <div className = "playerInfo" style={{backgroundColor: this.props.color}}>
            <img className="avatar" src={this.props.image} alt="player avatar"></img>
            <h3>Player Assets</h3>
            <p>Career: {this.props.career}</p>
            <p>Salary: ${this.props.salary}</p>
            <p>Cash: ${this.props.cash}</p>
            <p>Programming Languages: {this.props.languages.toString()}</p>
            <p>Houses: {this.props.houses.toString()}</p>
            </div>
        )
    }

}
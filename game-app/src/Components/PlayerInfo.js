import React, {Component} from 'react'
import { AvatarImage } from './services/AvatarImage';

export default class PlayerInfo extends Component {
    state = {
        image: 'Avatar1.png'
    };
    componentDidMount() {
        this.setState({image:AvatarImage.GetImage(this.props.playerInfo.image)});
    }


render(){
        return(
            <div className = "playerInfo" style={{backgroundColor: this.props.playerInfo.color}}>
            <img className="avatar" src={this.state.image} alt="player avatar"></img>
            <h3>Player Assets</h3>
            <p>Career: {this.props.playerInfo.career}</p>
            <p>Salary: ${this.props.playerInfo.salary}</p>
            <p>Cash: ${this.props.playerInfo.cash}</p>
            <p>Programming Languages: {this.props.playerInfo.languages.toString()}</p>
            <p>Houses: {this.props.playerInfo.houses.toString()}</p>
            </div>
        )
    }

}
import React, {Component} from 'react'
import { AvatarImage } from './services/AvatarImage';

export default class OpponentInfo extends Component {
    state = {
        image: 'Avatar2.png'
    };
    componentDidMount() {
        this.setState({image:AvatarImage.GetImage(this.props.playerInfo.image)});
    }


render(){
        return(
            <div className = "opponentInfo" style={{backgroundColor: this.props.playerInfo.color}}>
            <img className="opponentAvatar" src={this.state.image} alt="opponent avatar"></img>
            <div>
            <p>Username: {this.props.playerInfo.username}</p>
            <p>Career: {this.props.playerInfo.career}</p>
            <p>Cash: ${this.props.playerInfo.cash}</p>
            </div>
            
            </div>
        )
    }

}
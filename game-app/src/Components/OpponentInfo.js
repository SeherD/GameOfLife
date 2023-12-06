import React, {Component} from 'react'
import { AvatarImage } from './services/AvatarImage';

export default class OpponentInfo extends Component {
    state = {
        image: 'Avatar3.png'
    };
    componentDidMount() {
        this.setState({image:AvatarImage.GetImage(this.props.playerInfo.image)});
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps!= this.props){
            console.log(this.props.playerInfo.image);
        this.setState({image:AvatarImage.GetImage(this.props.playerInfo.image)});}
    }


    render() {
        const { playerInfo } = this.props;
      
        if (!playerInfo) {
          // If playerInfo is undefined, you can return a default or loading state
          return <div>Loading...</div>;
        }
      
        return (
          <div className="opponentInfo" style={{ backgroundColor: playerInfo.color }}>
            <img className="opponentAvatar" src={this.state.image} alt="opponent avatar" />
            <div>
              <p>Username: {playerInfo.username}</p>
              <p>Career: {playerInfo.career}</p>
              <p>Cash: ${playerInfo.cash}</p>
            </div>
          </div>
        );
      }
    }
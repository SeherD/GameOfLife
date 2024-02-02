import React, {Component, useState, useEffect} from 'react'
import { AvatarImage } from './services/AvatarImage';

export default class OpponentInfo extends Component {
    state = {
        image: 'Avatar3.png',
        width: 0,
        height: 0,
        show: true,
    };

    updateDimensions = () => {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    componentDidMount() {
        this.setState({image:AvatarImage.GetImage(this.props.playerInfo.image)});
        window.addEventListener("resize", this.updateDimensions);
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.playerInfo && prevProps.playerInfo !== this.props.playerInfo) {
          console.log(this.props.playerInfo.image);
          this.setState({ image: AvatarImage.GetImage(this.props.playerInfo.image) });
      }
  }

   componentWillUnmount(){
      window.removeEventListener("resize", this.updateDimensions);
   }


    render() {
        const { playerInfo } = this.props;
      
        if (!playerInfo) {
          // If playerInfo is undefined, you can return a default or loading state
          return <div></div>;
        }

        else if(this.state.width <= 760 && this.state.show === false){
          return(
            <div className="opponentButton" style = {{backgroundColor: playerInfo.color}} onClick = {() =>
              {
                this.setState({show : true});
              }}>
              <img className="opponentAvatar" src = {this.state.image} ></img>
            </div>
            );

        }

        else if(this.state.width <= 760 && this.state.show === true){
          return(
            <div className="opponentInfo" style = {{backgroundColor: playerInfo.color}} onClick = {() => 
              {
                this.setState({show : false});
              }}>
               <img className="opponentAvatar" src = {this.state.image} alt = "opponent avatar" />
               <div>
                <p>Username: {playerInfo.username}</p>
                <p>Career: {playerInfo.career}</p>
                <p>Cash ${playerInfo.cash}</p>
               </div>
              </div>
          );
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
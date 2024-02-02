import React, {Component, useState, useEffect} from 'react'
import { AvatarImage } from './services/AvatarImage';


export default class PlayerInfo extends Component {


    state = {

        image: 'Avatar1.png',
        show: false,
        isMobile: false,
        width: 0,
        height: 0,
    };

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
      };

    componentDidMount() {
        this.setState({image:AvatarImage.GetImage(this.props.playerInfo.image)});
        window.addEventListener('resize', this.updateDimensions);
        this.render()
    };

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props){
            console.log(this.props.playerInfo.image);
        this.setState({image:AvatarImage.GetImage(this.props.playerInfo.image)});}
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
      
      
    

    render(){

    if(this.state.width >= 760){
        return(
            <div className = "playerInfo" style={{backgroundColor: this.props.playerInfo.color}}>
            <img className="avatar" src={this.state.image}alt="player avatar"></img>
            <h3>Player Assets</h3>
            <p>Career: {this.props.playerInfo.career}</p>
            <p>Salary: ${this.props.playerInfo.salary}</p>
            <p>Cash: ${this.props.playerInfo.cash}</p>
            <p>Programming Languages: {this.props.playerInfo.languages.join(', ')}</p>
            <p>Houses: {this.props.playerInfo.houses.join(', ')}</p> 
            </div>
        );
    }
   else if(this.state.show === false){
        return(
            <div className = "avatarButton"  style={{backgroundColor: this.props.playerInfo.color}}>
            <img className="avatar" src={this.state.image} alt="player avatar" onClick ={() =>
            {
                this.setState({show:true});
            }} ></img>
            </div>
        )
    }
    else if (this.state.show === true){
        return(
            <div className = "playerInfo" style={{backgroundColor: this.props.playerInfo.color}}>
            <img className="avatar" src={this.state.image} alt="player avatar" onClick ={() =>
            {
                this.setState({show: false});
            }} ></img>
            <div className = "text">
            <p>Career: {this.props.playerInfo.career}</p>
            <p>Salary: ${this.props.playerInfo.salary}</p>
            <p>Cash: ${this.props.playerInfo.cash}</p>
            <p>Programming Languages: {this.props.playerInfo.languages.join(', ')}</p>
            <p>Houses: {this.props.playerInfo.houses.join(', ')}</p> 
            </div>
            </div>
        );
        
    }
    }

}
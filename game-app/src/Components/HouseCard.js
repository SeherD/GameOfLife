import React, {Component} from 'react'

export default class HouseCard extends Component {


render(){
        return(
            <div className = "card">
            <img className="cardImage" src={this.props.image} alt="house display"/>
            <p>{this.props.name}</p>
            </div>
        )
    }

}
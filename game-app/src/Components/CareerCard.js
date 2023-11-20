import React, {Component} from 'react'

export default class CareerCard extends Component {

    render() {
        return(
            <div className = "card">
                <img className="cardImage" src={this.props.image} alt="career display"/>
                <p>{this.props.name}</p>
            </div>
        )
    }
}
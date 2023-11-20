import React, {Component} from 'react'

export default class PathCard extends Component {
    render() {
        return(
            <div className = "card">
                <img className="cardImage" src={this.props.image} alt="path display"/>
                <p>{this.props.name}</p>
            </div>
        )
    }
}
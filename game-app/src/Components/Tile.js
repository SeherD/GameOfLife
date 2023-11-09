import React, {Component} from 'react'

export default class Tile extends Component {

    render(){
        return(
            <div className = "tile" style={{backgroundColor: this.props.color}}>
            {this.props.word}
            </div>
        )
    }

}
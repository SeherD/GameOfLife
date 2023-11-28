import React, {Component} from 'react'
// I commented out code I tried for animating the movement of the pieces, since it wasn't working
// import { Motion, spring } from 'react-motion'

export default class Piece extends Component {

    render() {

        const { color, tile } = this.props;
        const rowIndex = Math.floor(tile/15);
        const columnIndex = tile % 15;
        const x = columnIndex > 7 ? (columnIndex - 7) * 50 - 25 : (columnIndex - 7)* 50 - 25;
        const y = rowIndex > 7 ? (rowIndex - 7) * 50 - 25 : (rowIndex - 7)* 50 - 25;
        
        return(
            // <Motion style={{x: spring(x), y: spring(y)}}>
            //     {interpolatedStyle =>
                    <div
                        className='playerPiece'
                        style={{
                            backgroundColor: color,
                            // transform: `translate3d(${interpolatedStyle[x]}px, ${interpolatedStyle[y]}px, 0)`,
                            top: `calc(50vh + ${y}px)`,
                            left: `calc(50vw + ${x}px)`,
                        }}
                    />
            //     }
            // </Motion>
        )
    }
}
import React, {Component} from 'react'
// I commented out code I tried for animating the movement of the pieces, since it wasn't working
// import { Motion, spring } from 'react-motion'

export default class Piece extends Component {

    render() {

        const { color, tile, boardOffsetLeft } = this.props;
        const rowIndex = Math.floor(tile/15);
        const x = rowIndex * 50;
        console.log('row index:', rowIndex);
        const columnIndex = tile % 15;
        const y = columnIndex * 50 + boardOffsetLeft;
        console.log('column index:', columnIndex);

        console.log('Rendering Piece component with tile:', tile);

        return(
            // <Motion style={{x: spring(x), y: spring(y)}}>
            //     {interpolatedStyle =>
                    <div
                        className='playerPiece'
                        style={{
                            backgroundColor: color,
                            // transform: `translate3d(${interpolatedStyle[x]}px, ${interpolatedStyle[y]}px, 0)`,
                            top: `${x}px`,
                            left: `${y}px`,
                        }}
                    />
            //     }
            // </Motion>
        )
    }
}
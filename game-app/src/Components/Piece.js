import React, {Component} from 'react'

export default class Piece extends Component {

    render() {

        const { color, tile } = this.props;
        const rowIndex = Math.floor(tile/15);
        const columnIndex = tile % 15;
        const x = columnIndex > 7 ? (columnIndex - 7) * 50 - 25 : (columnIndex - 7)* 50 - 25;
        const y = rowIndex > 7 ? (rowIndex - 7) * 50 - 25 : (rowIndex - 7)* 50 - 25;
        
        return(
                    <div
                        className='playerPiece'
                        style={{
                            backgroundColor: color,
                            top: `calc(50vh + ${y}px)`,
                            left: `calc(50vw + ${x}px)`,
                        }}
                    />
        )
    }
}
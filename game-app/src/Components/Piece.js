
import React, {Component} from 'react'

export default class Piece extends Component {

    state = {
        width: 0, 
        height: 0
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
      };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    };


    render() {

        const { color, tile } = this.props;
        const rowIndex = Math.floor(tile/15);
        const columnIndex = tile % 15;
       /* const x = columnIndex > 7 ? (columnIndex - 7) * 50 - 25 : (columnIndex - 7)* 50 - 25;
        const y = rowIndex > 7 ? (rowIndex - 7) * 50 - 25 : (rowIndex - 7)* 50 - 25;*/

        const x = rowIndex * 50;
        const y = columnIndex * 50;

        if(this.state.width <= 760){
        
            return(
                        <div
                            className='playerPiece'
                            style={{
                                backgroundColor: color,
                                top: `calc(${x}px)`,
                                left: `calc(${y}px)`,
                            }}
                        />
            )
        }
        else{

            return(
                <div
                    className='playerPiece'
                    style={{
                        backgroundColor: color,
                        top: `calc(${x}px + 11vh)`,
                        left: `calc(${y}px + (54vw - 435px))`,
                    }}
                />
            )
        }

    }
}

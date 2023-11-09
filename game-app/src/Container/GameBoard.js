import React, {Component} from 'react';
import Tile from '../Components/Tile'


export default class GameBoard extends Component{
    state = {
        emptyPoints: [208, 204, 193, 178, 177, 162, 161, 174, 144, 130, 131, 132, 119, 104, 59, 74, 
        88,87, 71, 56, 26, 14, 12, 9, 8, 7, 6, 20, 35, 2, 17, 16, 15, 48, 47, 45, 60, 75, 78, 79, 81,
        96, 97, 112, 126, 125, 123, 122, 157, 155, 154, 153, 169, 183, 182, 213, 214, 200],
        careerPoints: [44, 13, 49, 124],
        paydayPoints: [189, 159, 133, 29, 10, 4, 50, 30, 76, 142, 156, 137, 197],
        stopPoints: [160, 89, 5, 127, 184],
        startPoints: [223, 219],
        endPoints: [185],
        housePoints: [134, 11, 80, 152],
        skillPoints: [129, 86, 41, 3, 46, 77, 212, 215]
    }

    createBoard = () =>{

        return Array.from({ length: 15 }).map((_, rowIndex) => 
        <div style={{ display: 'flex' }}>{
          Array.from({ length: 15 }).map((_, colIndex) => {
            var num = rowIndex*15 + colIndex;
            console.log(num);
                if(this.state.careerPoints.includes(num)){
                    return <Tile
                                number = {num}
                                word = {"Career"}
                                color = {"purple"}
                                ></Tile>
                } else if(this.state.emptyPoints.includes(num)){
                    return <Tile number = {num} 
                    color = {"yellow"}
                    word = {""}
                    />
                } else if(this.state.paydayPoints.includes(num)){
                    return <Tile number = {num} 
                    color = {"darkgreen"}
                    word = {"PayDay"}
                    />
                } else if(this.state.stopPoints.includes(num)){
                    return <Tile number = {num} 
                    color = {"red"}
                    word = {"STOP"}
                    />
                } else if(this.state.startPoints.includes(num)){
                    return <Tile number = {num} 
                    color = {"orange"}
                    word = {"Start"}
                    />
                } else if(this.state.endPoints.includes(num)){
                    return <Tile number = {num} 
                    color = {"orange"}
                    word = {"Retirement!"}
                    />
                } else if(this.state.housePoints.includes(num)){
                    return <Tile number = {num} 
                    color = {"blue"}
                    word = {"House"}
                    />
                } else if(this.state.skillPoints.includes(num)){
                    return <Tile number = {num} 
                    color = {"pink"}
                    word = {"Skills"}
                    />
                } else {
                return <Tile number = {num} 
                    color = {"green"}
                    word = {""}
                />
                }

          })}
          </div>
          );
    }
  

    

    render() {return (
    <div>
        {this.createBoard()}
    </div>
  );}
}
import React, {Component} from 'react';
import Tile from '../Components/Tile'
import WheelComponent from 'react-wheel-of-prizes'
import HouseCard from '../Components/HouseCard';
//import 'react-wheel-of-prizes/dist/index.css'




export default class GameBoard extends Component{
state = {
            emptyPoints: [209, 204, 194, 179, 178, 177, 176, 174, 145, 146, 147, 134, 104, 
            118, 117, 115, 99, 84, 85, 88, 24, 39, 8, 7, 20, 35, 2, 3, 16, 15, 48, 47, 45, 60, 75, 78, 79, 81,
            96, 97, 112, 126, 125, 123, 122, 157, 155, 154, 153, 169, 183, 182, 213, 214, 200],
            careerPoints: [89, 87, 49, 124],
            paydayPoints: [189, 159, 148, 86, 54, 4, 50, 30, 76, 142, 156, 137, 197],
            stopPoints: [175, 119, 5, 127, 184],
            startPoints: [224, 219],
            endPoints: [185],
            housePoints: [149, 69, 6, 80, 152],
            skillPoints: [144, 116, 114, 9, 17, 46, 77, 212, 215],
            segments: ['1', '2', '3', '4', '5', '6'],
            segColors: ['#fcf910',
                        '#e93131',
                        '#b3da42',
                        '#28c3f3',
                        '#fa1da9',
                        '#ba38b4'
                        ]
        }
   

    onFinished = (winner) => {
        console.log(winner)
      }  

    createBoard = () =>{

        return Array.from({ length: 15 }).map((_, rowIndex) => 
        <div className ='boardRow'>{
          Array.from({ length: 15 }).map((_, colIndex) => {
            var num = rowIndex*15 + colIndex;
                if(this.state.careerPoints.includes(num)){
                    return <Tile
                                key = {num}
                                word = {"Career"}
                                color = {"purple"}
                                ></Tile>
                } else if(this.state.emptyPoints.includes(num)){
                    return <Tile key = {num} 
                    color = {"yellow"}
                    word = {""}
                    />
                } else if(this.state.paydayPoints.includes(num)){
                    return <Tile key = {num} 
                    color = {"darkgreen"}
                    word = {"PayDay"}
                    />
                } else if(this.state.stopPoints.includes(num)){
                    return <Tile key = {num} 
                    color = {"red"}
                    word = {"STOP"}
                    />
                } else if(this.state.startPoints.includes(num)){
                    return <Tile key = {num} 
                    color = {"orange"}
                    word = {"Start"}
                    />
                } else if(this.state.endPoints.includes(num)){
                    return <Tile key = {num} 
                    color = {"orange"}
                    word = {"Retirement!"}
                    />
                } else if(this.state.housePoints.includes(num)){
                    return <Tile key = {num} 
                    color = {"blue"}
                    word = {"House"}
                    />
                } else if(this.state.skillPoints.includes(num)){
                    return <Tile key = {num} 
                    color = {"pink"}
                    word = {"Skills"}
                    />
                } else {
                return <Tile key = {num} 
                    color = {"green"}
                    word = {""}
                />
                }

          })}
          </div>
          );
    }
  

    

    render() {return (
        <div className='board'>
            {this.createBoard()}
            <div className='spinner'>
                <WheelComponent
                    segments={this.state.segments}
                    segColors={this.state.segColors}
                    onFinished={(winner) => this.onFinished(winner)}
                    isOnlyOnce={false}
                    downDuration={500} />
            </div>

  
    </div>
  );}
}
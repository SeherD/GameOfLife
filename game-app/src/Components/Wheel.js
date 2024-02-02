
import React, {Component} from "react";
import WheelComponent from "react-wheel-of-prizes";
import Dice from "react-dice-roll"


export default class Wheel extends Component{

    constructor(props){
        super(props);
        this.state = {
            width:  0,
            segments: ['1', '2', '3', '4', '5', '6'],
           segColors: ['#FFEB3B',
            "#FF5252",
            '#228B22',
            '#2196F3',
            '#FF4081',
            '#9370DB'
            ]
        };

    };

    updateDimensions = () => {
        this.setState({ width: window.innerWidth});
      
    };

    componentDidMount(){
        window.addEventListener("resize", this.updateDimensions);
    }

    disable(){

    }


    render(){

        if(this.state.width <= 760){
            return(
            <div className= "wheel" id = "dice">
                <Dice onRoll = {(value) => this.props.onFinished(value)} size = {100} style = {{pointerEvents: "auto"}}/>

            </div>
            )
        }
        else{
            return(
                <div>
                    <WheelComponent className = "wheel"
                            segments={this.state.segments}
                            segColors={this.state.segColors}
                            onFinished={(winner) => this.props.onFinished(winner)}
                            isOnlyOnce={false}
                            downDuration={500}
                    />
                </div>
            )

        }




    }
}
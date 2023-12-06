import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import sidepath from '../assets/Paths/side_path.jpg';
import mainpath from '../assets/Paths/main_path.jpg';
import PathCard from './PathCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default class StopModal2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0
        };
    }
  
    handleSlideChange = (index) => {
        this.setState({ currentSlide: index });
    };

    handleClose = () => {
        const { handleClose, onModalClose } = this.props;
        // Use the callback to send the current slide index to GameBoard.js
        if (onModalClose) {
            onModalClose(this.state.currentSlide);
        }
        // Close the modal
        handleClose();
    }
  
    render() {
        return (
            <div>
                <h1>Choose a path</h1>
                <Carousel onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                    <PathCard name = {'Side path 2'} image={sidepath} />
                    <PathCard name = {'Main path'} image={mainpath} />
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
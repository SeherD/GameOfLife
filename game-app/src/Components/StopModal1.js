import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import sidepath from '../assets/sidepath.png';
import mainpath from '../assets/mainpath.png';
import PathCard from './PathCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default class StopModal1 extends Component {
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
            onModalClose(this.state.currentSlide, this.state.open);
        }
        // Close the modal
        handleClose();
    }
  
    render() {
        return (
            <div>
                <Carousel onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                    <PathCard name = {'Main path'} image={mainpath} />
                    <PathCard name = {'Side path 1'} image={sidepath} />
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
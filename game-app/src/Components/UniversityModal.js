import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import university from '../assets/university.png';
import bootcamp from '../assets/bootcamp.png';
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
                    <PathCard name = {'University Path'} image={university} />
                    <PathCard name = {'Bootcamp Path'} image={bootcamp} />
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
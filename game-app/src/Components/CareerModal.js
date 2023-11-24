import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import webdev from '../assets/webdev.png';
import startup from '../assets/startup.png';
import CareerCard from './CareerCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default class CareerModal extends Component {
    careers = ['Web Developer','Startup CEO'];
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            currentCareer: 'Web Developer'
        };
    }
  
    handleSlideChange = (index) => {
        this.setState({ currentSlide: index, currentCareer: this.careers[index] });
    };

    handleClose = () => {
        const { handleClose, onModalClose } = this.props;
        // Use the callback to send the current slide index and current career to GameBoard.js
        if (onModalClose) {
            onModalClose(this.state.currentSlide, this.state.currentCareer);
        }
        // Close the modal
        handleClose();
    }
  
    render() {
        return (
            <div>
            <h1>Choose a career</h1>
                <Carousel onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                    <CareerCard name = {'Web Developer'} image={webdev} />
                    <CareerCard name = {'Startup CEO'} image={startup} />
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
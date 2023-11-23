import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import house from '../assets/house.jpg';
import apartment from '../assets/apartment.jpg';
import HouseCard from './HouseCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default class HouseModal extends Component {
    houses = ['House','Apartment'];
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            currentHouse: 'House'
        };
    }
  
    handleSlideChange = (index) => {
        this.setState({ currentSlide: index, currentHouse: this.houses[index] });
    };

    handleClose = () => {
        const { handleClose, onModalClose } = this.props;
        // Use the callback to send the current slide index and current house to GameBoard.js
        if (onModalClose) {
            onModalClose(this.state.currentSlide, this.state.currentHouse);
        }
        // Close the modal
        handleClose();
    }
  
    render() {
        return (
            <div>
                <Carousel onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                    <HouseCard name = {'House'} image={house} />
                    <HouseCard name = {'Apartment'} image={apartment} />
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
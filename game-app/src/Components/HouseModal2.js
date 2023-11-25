import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import house from '../assets/house.jpg';
import apartment from '../assets/apartment.jpg';
import nohouse from '../assets/nohouse.png';
import HouseCard from './HouseCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default class HouseModal2 extends Component {
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
            <h1>Choose a house</h1>
                <Carousel onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                    <HouseCard name = {'House'} image={house} price={200000} />
                    <HouseCard name = {'Apartment'} image={apartment} price={100000} />
                    <HouseCard name = {'None'} image={nohouse} price={0} />
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
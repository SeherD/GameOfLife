import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import house from '../assets/house.jpg';
import apartment from '../assets/apartment.jpg';
import nohouse from '../assets/nohouse.png';
import HouseCard from './HouseCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default class HouseSaleModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            currentHouseId: 'H1'
        };
    }

    handleSlideChange = (index) => {
        this.setState({ currentSlide: index, currentHouse: this.props.houseOptions[index].HouseID });
    };

    handleClose = () => {
        const { handleClose, onModalClose } = this.props;
        // Use the callback to send the current slide index and current house to GameBoard.js
        if (onModalClose) {
            onModalClose(this.state.currentSlide, this.state.currentHouseId);
        }
        // Close the modal
        handleClose();
    }

    populateHouses = () =>{
        return this.props.houseOptions.map((house)=>(
            <HouseCard key = {house.HouseID} name = {house.Name} image = {apartment} price = {house.Cost}/> 
        ))
    }
  
  
    render() {
        return (
            <div>
            <h1>Choose a house to sell</h1>
                <Carousel onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                    {this.populateHouses()}
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
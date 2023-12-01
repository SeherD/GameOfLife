import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import house from '../assets/house.jpg';
import apartment from '../assets/apartment.jpg';
import nohouse from '../assets/nohouse.png';
import HouseCard from './HouseCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';

export default class HousePurchaseModal extends Component {
    houses = ['House','Apartment'];
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            currentHouseId: 'H1',
            houseOptions: []
        };
    }
  
    componentDidMount() {
        axios({
            method: "GET",
            url:"http://localhost:5000/house/unused"
          })
          .then((response) => {
            this.setState({houseOptions: response.data.unused_house_cards});

          })
    }
    handleSlideChange = (index) => {
        this.setState({ currentSlide: index, currentHouse: this.state.houseOptions[index].HouseID });
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
        return this.state.houseOptions.map((house)=>(
            <HouseCard key = {house.HouseID} name = {house.Name} image = {apartment} price = {house.Cost}/> 
        ))
    }
  
    render() {
        return (
            <div>
            <h1>Choose a house to buy</h1>
                {/* TODO: call a flask endpoint to display all the houses not owned by any player */}
                <Carousel className="modal" onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                    {this.populateHouses()}
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
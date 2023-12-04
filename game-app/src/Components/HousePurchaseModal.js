import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import house from '../assets/house.jpg';
import apartment from '../assets/apartment.jpg';
import nohouse from '../assets/nohouse.png';
import HouseCard from './HouseCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';
import { HouseImage } from './services/HouseImage.js';

export default class HousePurchaseModal extends Component {
    houses = ['House','Apartment'];
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            houseOptions: [],
            houseCards: []
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

    componentDidUpdate(prevProps, prevState) {
        // Check if house options have changed
        if (prevState.houseOptions !== this.state.houseOptions) {
            // Populate career cards and update state
            this.populateHouses().then(houseCards => {
                this.setState({ houseCards });
            });
        }
    }

    handleSlideChange = (index) => {
        this.setState({ currentSlide: index}, console.log("changing to " + this.state.houseOptions[index].HouseID ));
    };

    handleClose = () => {
        const { handleClose, onModalClose } = this.props;
        // Use the callback to send the current slide index and current house to GameBoard.js
        if (onModalClose) {
            onModalClose(this.state.currentSlide, this.state.houseOptions[this.state.currentSlide].HouseID);
        }
        // Close the modal
        handleClose();
    }

    populateHouses = async () =>{
        const cards = await Promise.all(this.state.houseOptions.map(async (house) => {
            const img = HouseImage.GetImage(house.Image);
            return <HouseCard key = {house.HouseID} name = {house.Name} image = {img} price = {house.Cost}/>; 
    }));
        return cards;
    }
  
    render() {
        return (
            <div>
            <h1>Choose a house to buy</h1>
                <Carousel className="modal" onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                    {this.state.houseCards}
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
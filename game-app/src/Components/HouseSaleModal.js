import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import house from '../assets/house.jpg';
import apartment from '../assets/apartment.jpg';
import nohouse from '../assets/nohouse.png';
import HouseCard from './HouseCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { HouseImage } from './services/HouseImage.js';

export default class HouseSaleModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            houseCards: []
        };
    }

    componentDidMount() {
            // Populate career cards and update state
            this.populateHouses().then(houseCards => {
                this.setState({ houseCards });
            });
    }

    handleSlideChange = (index) => {
        this.setState({ currentSlide: index });
    };

    handleClose = () => {
        // Use the callback to send the current slide index and current house to GameBoard.js
        if (this.props.handleSale) {
            this.props.handleSale(this.props.houseOptions[this.state.currentSlide].HouseID);
        }
        // Close the modal
        this.props.handleClose();
    }

    populateHouses = async () =>{
        const cards = await Promise.all(this.props.houseOptions.map(async (house) => {
            const img = HouseImage.GetImage(house.Image);
            return <HouseCard key = {house.HouseID} name = {house.Name} image = {img} price = {house.Cost}/>; 
    }));
        return cards;
    }
  
  
    render() {
        return (
            <div>
            <h1>Choose a house to sell</h1>
                <Carousel className="modal" onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                    {this.state.houseCards}
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
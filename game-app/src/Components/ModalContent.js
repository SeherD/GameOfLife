import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import HouseCard from './HouseCard';
import CareerCard from './CareerCard';
import house from '../assets/house.jpg';
import apartment from '../assets/apartment.jpg';
import webdev from '../assets/webdev.png';
import startup from '../assets/startup.png';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import StopModal1 from './StopModal1';

export default class ModalContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: props.type,
            stopID: props.stopID,
            slide: 0
        }
    }

    render() {
        if (this.state.type === "House") {
            return(
                <div>
                    {/*Carousel to browse through options and then a button to select
                    TODO: populate carousel with a function that makes a call to the database
                    and gets all of the options' information to populate*/}
                    <Carousel showThumbs={false} showArrows={true}>
                        <HouseCard name = {'House'} image={house} />
                        <HouseCard name = {'Apartment'} image={apartment} />
                    </Carousel>  
                    <button onClick={this.props.handleClose}>Select</button>
                </div>
            );
        } else if (this.state.type === "Career") {
            return(
                <div>
                    {/*Carousel to browse through options and then a button to select
                    TODO: populate carousel with a function that makes a call to the database
                    and gets all of the options' information to populate*/}
                    <Carousel showThumbs={false} showArrows={true}>
                        <CareerCard name = {'Web Developer'} image={webdev} />
                        <CareerCard name = {'Startup CEO'} image={startup} />
                    </Carousel>
                    <button onClick={this.props.handleClose}>Select</button>
                </div>
            );
        } else if (this.state.type === "STOP" && this.state.stopID === 119) {
            return(
                <StopModal1 handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
            );
        }
    }
}
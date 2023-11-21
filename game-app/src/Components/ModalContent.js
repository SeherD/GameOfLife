import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import HouseCard from './HouseCard';
import house from '../assets/house.jpg';
import apartment from '../assets/apartment.jpg';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import StopModal1 from './StopModal1';
import StopModal2 from './StopModal2';
import StopModal3 from './StopModal3';
import StopModal4 from './StopModal4';
import CareerModal from './CareerModal';

export default class ModalContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: props.type,
            stopID: props.stopID,
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
                <CareerModal handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
            );
        } else if (this.state.type === "STOP" && this.state.stopID === 119) {
            return(
                <StopModal1 handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
            );
        } else if (this.state.type === "STOP" && this.state.stopID === 5) {
            return(
                <StopModal2 handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
            );
        } else if (this.state.type === "STOP" && this.state.stopID === 127) {
            return(
                <StopModal3 handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
            );
        } else if (this.state.type === "STOP" && this.state.stopID === 184) {
            return(
                <StopModal4 handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
            );
        }
    }
}
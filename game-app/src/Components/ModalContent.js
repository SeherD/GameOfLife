import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import HouseCard from './HouseCard';
import house from '../assets/house.jpg';
import apartment from '../assets/apartment.jpg';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default class ModalContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: props.type,
            close: props.handleClose
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
                    <button onClick={this.state.close}>Select</button>
                </div>
            );
        }
    }
}
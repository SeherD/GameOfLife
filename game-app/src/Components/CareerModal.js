import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import CareerCard from './CareerCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';
import { CareerImage } from './services/CareerImage.js';

export default class CareerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            careerOptions: [],
            careerCards: []
        };
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: "http://localhost:5000/career/filterByUniversity/P" + (this.props.playerIndex + 1),
        })
        .then((response) => {
            this.setState({ careerOptions: response.data.available_career_cards });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // Check if career options have changed
        if (prevState.careerOptions !== this.state.careerOptions) {
            // Populate career cards and update state
            this.populateModal().then(careerCards => {
                this.setState({ careerCards });
            });
        }
    }

    handleSlideChange = (index) => {
        this.setState({ currentSlide: index });
    };

    handleClose = () => {
        const { handleClose, onModalClose } = this.props;
        if (onModalClose) {
            onModalClose(this.state.currentSlide, this.state.careerOptions[this.state.currentSlide].CareerID);
        }
        handleClose();
    }

    populateModal = async () => {
        const cards = await Promise.all(this.state.careerOptions.map(async (career) => {
            const img = CareerImage.GetImage(career.Image);
            return <CareerCard key={career.CareerID} name={career.Name} image={img} salary={career.Salary} />;
        }));
        return cards;
    }

    render() {
        return (
            <div>
                <h1>Choose a career</h1>
                <Carousel className="modal" onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                    {this.state.careerCards}
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
        );
    }
}

import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import webdev from '../assets/webdev.png';
import CareerCard from './CareerCard.js';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';

export default class CareerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0,
            currentCareerId: 'C1',
            careerOptions: []
        };
    }

    componentDidMount() {
        axios({
            method: "GET",
            url:"http://localhost:5000/career/filterByUniversity/P" + (this.props.playerIndex + 1),
          })
          .then((response) => {
            this.setState({careerOptions: response.data.available_career_cards});

          })
    }
  
    handleSlideChange = (index) => {
        this.setState({ currentSlide: index, currentCareerId: this.state.careerOptions[index].CareerID });
    };

    handleClose = () => {
        const { handleClose, onModalClose } = this.props;
        // Use the callback to send the current slide index and current career to GameBoard.js
        if (onModalClose) {
            onModalClose(this.state.currentSlide, this.state.currentCareerId);
        }
        // Close the modal
        handleClose();
    }


    populateModal = () =>{
        return this.state.careerOptions.map((career) =>(
            <CareerCard key = {career.CareerID} name = {career.Name} image = {webdev} salary = {career.Salary} />
        ))
    }
  
    render() {
        return (
            <div>
            <h1>Choose a career</h1>
                <Carousel className="modal" onChange={this.handleSlideChange} onSlideChange={this.props.onSlideChange} showThumbs={false} showArrows={true}>
                   {this.populateModal()}
                </Carousel>
                <button onClick={this.handleClose}>Select</button>
            </div>
          );
    }
}
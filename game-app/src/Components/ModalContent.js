import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import HouseModal from './HouseModal';
import CareerModal from './CareerModal';
import StopModal1 from './StopModal1';
import StopModal2 from './StopModal2';
import StopModal3 from './StopModal3';
import StopModal4 from './StopModal4';
import UniversityModal from './UniversityModal';
import SkillsModal from './SkillsModal';
import { getRandomLanguage } from '../Components/Languages';


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
                <HouseModal handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
            );
        } else if (this.state.type === "Career") {
            return(
                <CareerModal playerIndex={this.props.playerIndex} handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
            );
        } else if (this.state.type === "STOP" && this.state.stopID === 175) {
            return(
                <CareerModal playerIndex={this.props.playerIndex} handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
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
        } else if (this.state.type === "University") {
            return(
                <UniversityModal handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
            );
        } else if (this.state.type === "Skills"){
            return(
                <SkillsModal handleClose={this.props.handleClose} onModalClose={this.props.onModalClose}
                    freeSkill={getRandomLanguage()} riskySkill={getRandomLanguage()}
                /> 
            );
        }
    }
}
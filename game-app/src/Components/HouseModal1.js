import React, { Component } from 'react';
import Modal from 'react-modal'
import HouseModal2 from './HouseModal2.js';

export default class HouseModal1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    openSelectionModal = () => {
        this.setState({open: true});
    }

    handleClose = () => {
        // Close the modal
        this.props.handleClose();
    }
  
    render() {
        const customStyles = {
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
        };
        return (
            <div>
                <h1>Buy a house?</h1>
                <button onClick={this.openSelectionModal}>Yes</button>
                <button onClick={this.handleClose}>No</button>
                {/* Pass the functions in props to the house selection modal */}
                <Modal
                    ariaHideApp={false}
                    isOpen = {this.state.open}
                    onRequestClose={this.handleClose}
                    shouldCloseOnEsc={false}
                    shouldCloseOnOverlayClick={false}
                    style={customStyles}>
                    <HouseModal2 isOpen = {this.state.open} handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
                </Modal>
            </div>
          );
    }
}
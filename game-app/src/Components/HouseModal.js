import React, { Component } from 'react';
import Modal from 'react-modal'
import HousePurchaseModal from './HousePurchaseModal.js';
import HouseSaleModal from './HouseSaleModal.js';

export default class HouseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchaseModalOpen: false,
            saleModalOpen: false
        };
    }

    handleHousePurchase = () => {
        this.setState({purchaseModalOpen: true});
    }

    handleHouseSale = () => {
        this.setState({saleModalOpen: true});
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
                <h1>Buy or sell a house?</h1>
                <button onClick={this.handleHousePurchase}>Buy a house</button>
                <button onClick={this.handleHouseSale}>Sell a house</button>
                <button onClick={this.handleClose}>No</button>
                {/* Pass the functions in props to the house selection modal */}
                {/* House purchase modal */}
                <Modal
                    ariaHideApp={false}
                    isOpen = {this.state.purchaseModalOpen}
                    onRequestClose={this.handleClose}
                    shouldCloseOnEsc={false}
                    shouldCloseOnOverlayClick={false}
                    style={customStyles}>
                    <HousePurchaseModal isOpen = {this.state.purchaseModalOpen} handleClose={this.props.handleClose} />
                </Modal>
                {/* House sale modal */}
                <Modal
                    ariaHideApp={false}
                    isOpen = {this.state.saleModalOpen}
                    onRequestClose={this.handleClose}
                    shouldCloseOnEsc={false}
                    shouldCloseOnOverlayClick={false}
                    style={customStyles}>
                    <HouseSaleModal isOpen = {this.state.saleModalOpen} handleClose={this.props.handleClose} onModalClose={this.props.onModalClose} />
                </Modal>
            </div>
          );
    }
}
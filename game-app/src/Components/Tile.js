import React, {Component} from 'react'
import Modal from 'react-modal'
import {Carousel} from 'react-responsive-carousel'
import HouseCard from './HouseCard'
import house from '../assets/house.jpg'
import apartment from '../assets/apartment.jpg'
import "react-responsive-carousel/lib/styles/carousel.min.css";


export default class Tile extends Component {
    constructor(props){
        super(props)
        this.state = {
            open: false
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleClick = () =>{
        this.setState({open: true})
    }

    handleClose = () =>{
        this.setState({open: false})
    }

render()
{
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
        return(
            <div >
            <div className = "tile" style={{backgroundColor: this.props.color}} >
            {this.props.word}
           <Modal
           ariaHideApp={false}
           isOpen = {this.state.open}
           onRequestClose={this.handleClose}
           style={customStyles}
           
           >
        <Carousel showThumbs={false}
        showArrows={true}>
         <HouseCard
        name = {'House'}
        image={house} />
        <HouseCard
        name = {'Apartment'}
        image={apartment} />
         
           </Carousel>  
           <button onClick={this.handleClose}>Select</button>
       
           </Modal>
            </div>
            </div>
        )
    }

}
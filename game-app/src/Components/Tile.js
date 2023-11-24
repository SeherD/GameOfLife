import React, {Component} from 'react'
import Modal from 'react-modal'
import ModalContent from './ModalContent'
import { getRandomLanguage } from '../Components/Languages';

export default class Tile extends Component {
    tileRef = React.createRef();

    constructor(props){
        super(props)
        this.state = {
            stopID: props.stopID,
            open: false,
            currentSlide: 0
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick = (player) =>{
        if (this.props.word === "House" || this.props.word === "Career" || this.props.word === "STOP") {
            this.setState({open: true})
        } else if (this.props.word === "Skills") {
            return getRandomLanguage();
        } else if (this.props.word === "PayDay") {
            return 2 * player.salary;
        }
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
            <div>
                <div className = "tile" style={{backgroundColor: this.props.color}} >
                    {this.props.word}
                    {/*Pop up to show the life options when a player lands on specific tiles*/}
                    <Modal
                        ariaHideApp={false}
                        isOpen = {this.state.open}
                        onRequestClose={this.handleClose}
                        shouldCloseOnEsc={false}
                        shouldCloseOnOverlayClick={false}
                        style={customStyles}>
                        <ModalContent type={this.props.word} stopID={this.state.stopID} handleClose={this.handleClose} onModalClose={this.props.onModalClose} />
                    </Modal>
                </div>
            </div>
        )
    }

}
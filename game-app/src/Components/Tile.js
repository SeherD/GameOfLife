import React, {Component} from 'react'
import Modal from 'react-modal'
import ModalContent from './ModalContent'

export default class Tile extends Component {
    tileRef = React.createRef();

    constructor(props){
        super(props)
        this.state = {
            stopID: props.stopID,
            open: false,
            currentSlide: 0,
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick = () =>{
        if (this.props.word !== "" && this.props.word !== "PayDay") {
            this.setState({open: true});
        } else if (this.props.word === "PayDay") {
            return 2;
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
                        <ModalContent playerIndex={this.props.playerIndex} type={this.props.word} stopID={this.state.stopID} handleClose={this.handleClose} onModalClose={this.props.onModalClose} handleRespin={this.props.handleRespin}/>
                    </Modal>
                </div>
            </div>
        )
    }

}
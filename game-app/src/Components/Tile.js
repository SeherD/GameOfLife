import React, {Component} from 'react'
import Modal from 'react-modal'
import ModalContent from './ModalContent'

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
            <div>
                <div className = "tile" style={{backgroundColor: this.props.color}} >
                    {this.props.word}
                    {/*Pop up to show the life options when a player lands on specific tiles*/}
                    <Modal
                        ariaHideApp={false}
                        isOpen = {this.state.open}
                        onRequestClose={this.handleClose}
                        style={customStyles}>
                        <ModalContent type={this.props.word} handleClose={this.handleClose} />
                    </Modal>
                </div>
            </div>
        )
    }

}
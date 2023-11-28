import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-modal'
import PlayerIcon from '../Components/PlayerIcon';
import avatar5 from '../assets/avatar5.jpg';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.jpg';
import avatar3 from '../assets/avatar3.jpg';
import avatar4 from '../assets/avatar4.jpg';

function LandingPage() {
  // eslint-disable-next-line
    const [waiting, setWaiting] = useState(false);
    const [signinModalOpen, setSigninModalOpen] = useState(false);
    const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
    const [signedIn, setSignedIn] = useState(false);

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
    <div className="LandingPage">
      <div>
        <h1>THE GAME OF LIFE <br/> SOFTWARE DEVELOPER EDITION</h1>
        {signedIn ?
            <button className="signoutButton" type="button" onClick={() => setSignedIn(false)}>SIGN OUT</button> :
            <button className="signinButton" type="button" onClick={() => setSigninModalOpen(true)}>SIGN IN</button>
        }
        <hr/>
      </div>
      <div>
        {waiting ?
            <h3>Waiting for players to join...</h3> :
            <h3>Ready to Start</h3>}
      </div>
      <div>
        <PlayerIcon image= {avatar1}
            host = {true}
            joined = {true}
        />
      </div>
      <div className="playerIconDiv">
        <PlayerIcon image= {avatar2}
            host = {false}
            joined = {true}
        />
        <PlayerIcon image= {avatar3}
            host = {false}
            joined = {true}
        />
      </div>
      <div className="playerIconDiv">
        <PlayerIcon image= {avatar4}
            host = {false}
            joined = {true}
        />
        <PlayerIcon image= {avatar5}
            host = {false}
            joined = {false}
        />
      </div>
    <div>
        {waiting ? <div/>: <div className="startButton"><Link to="/game">START GAME</Link></div>}
    </div>
    {/* Pop up to allow players to sign in*/}
    <Modal
        ariaHideApp={false}
        isOpen = {signinModalOpen}
        onRequestClose={() => setSigninModalOpen(false)}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        style={customStyles}>
        <div id="signinModal">
            <h1>Sign in</h1>
            <label>Username <input name="username" autoFocus={true} /></label>
            <label>Password <input name="password" /></label>
            <button onClick={() => {setSigninModalOpen(false); setSignedIn(true)}}>Sign in</button>
            {/* TODO: button should check if username/password combo is in DB, then call a flask endpoint to set the current account */}
            <p>Don't have an account?</p>
            <button onClick={() => {setCreateAccountModalOpen(true); setSigninModalOpen(false)}}>Create one</button>
        </div>
    </Modal>
    {/* Pop up to allow players to create an account*/}
    <Modal
        ariaHideApp={false}
        isOpen = {createAccountModalOpen}
        onRequestClose={() => setCreateAccountModalOpen(false)}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        style={customStyles}>
        <div id="signinModal">
            <h1>Create an account</h1>
            <label>Username <input name="username" autoFocus={true} /></label>
            <label>Password <input name="password" /></label>
            <button onClick={() => {setCreateAccountModalOpen(false); setSignedIn(true)}}>Sign in</button>
            {/* TODO: button should check if username is already in DB, and if password isn't empty, then add account to DB */}
            <p>Already have an account?</p>
            <button onClick={() => {setSigninModalOpen(true); setCreateAccountModalOpen(false)}}>Sign in</button>
        </div>
    </Modal>
    </div>
  );
}

export default LandingPage;

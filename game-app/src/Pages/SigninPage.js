import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-modal'

function SigninPage() {
    const [hasAccount, setHasAccount] = useState(true);
    const [joinGameModalOpen, setJoinGameModalOpen] = useState(false);

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
    <div className="SigninPage">
      <div>
        <h1>THE GAME OF LIFE <br/> SOFTWARE DEVELOPER EDITION</h1>
        <hr/>
        <div>
          {hasAccount ?
          <div className='signin'>
              <h2>Sign in to play!</h2>
              <label>Username <input name="username" autoFocus={true} /></label>
              <label>Password <input name="password" /></label>
              <button className='landingPageButton' onClick={() => {setJoinGameModalOpen(true)}}>Sign in</button>
              {/* TODO: button should check if username/password combo is in DB, then call a flask endpoint to set the current account */}
              <p>Don't have an account?</p>
              <button className='landingPageButton' onClick={() => {setHasAccount(false)}}>Create one</button>
          </div> :
          <div className='signin'>
              <h2>Create a new account</h2>
              <label>Choose a username <input name="username" autoFocus={true} /></label>
              <label>Choose a password <input name="password" /></label>
              <button className='landingPageButton' onClick={() => {setHasAccount(true)}}>Create account</button>
              {/* TODO: button should check if username is already in DB, and if password isn't empty, then add account to DB */}
              <p>Already have an account?</p>
              <button className='landingPageButton' onClick={() => {setHasAccount(true)}}>Sign in</button>
          </div>}
        </div>
      </div>
    {/* Pop up to allow players to join a game*/}
    <Modal
        ariaHideApp={false}
        isOpen = {joinGameModalOpen}
        onRequestClose={() => setJoinGameModalOpen(false)}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        style={customStyles}>
        <div id="joinGameModal">
            <h1>Play a game</h1>
            <Link to="/lobby"><button type='button'>Start a new game as host</button></Link>
            {/* TODO: Call a flask endpoint to create a new game */}
            {/* TODO: Call a flask endpoint to create a new player with host: true */}
            <p>Have a game code already?</p>
            <input name="gameCode" autoFocus={true} />
            <Link to="/lobby"><button type='button'>Join</button></Link>
            {/* TODO: Call a flask endpoint to get a game by gameID */}
            {/* TODO: Call a flask endpoint to create a new player with host: false */}
        </div>
    </Modal>
    </div>
  );
}

export default SigninPage;

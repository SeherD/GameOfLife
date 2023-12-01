import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-modal'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  
  function verifySignin() {
      const username = document.querySelector('[name="username"]').value;
      const password = document.querySelector('[name="password"]').value;
      {/* TODO: button should check if username/password combo is in DB, then call a flask endpoint to set the current account */}
      const validAccounts = {"user1": "password1", "user2": "password2", "user3": "password3"};
      if (validAccounts.hasOwnProperty(username) && validAccounts[username] === password) {
          toast.success('Login successful!', {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
          setJoinGameModalOpen(true);
      } else {
          toast('Invalid login, please try again', {
              position: "top-center",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              theme: "dark",
          });
      }
  }

  function verifyCreateAccount() {
      const username = document.querySelector('[name="newUsername"]').value;
      const password = document.querySelector('[name="newPassword"]').value;
      {/* TODO: button should check if username/password combo is in DB, then call a flask endpoint to set the current account */}
      const currentAccounts = {"user1": "password1", "user2": "password2", "user3": "password3"};
      if (username.length === 0) {
          toast('Username must not be null', {
              position: "top-center",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              theme: "dark",
          });
      } else if (password.length === 0) {
          toast('Password must not be null', {
              position: "top-center",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              theme: "dark",
          });
      } else if (currentAccounts.hasOwnProperty(username)) {
          toast('Username already exists', {
              position: "top-center",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              theme: "dark",
          });
      } else {
          toast.success('Successfully created account!', {
              position: "top-center",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              theme: "dark",
          });
          setHasAccount(true);
      }
  }

  return (
    <div className="SigninPage">
      <ToastContainer/>
      <div>
        <h1>THE GAME OF LIFE <br/> SOFTWARE DEVELOPER EDITION</h1>
        <hr/>
        <div>
          {hasAccount ?
          <div className='signin'>
              <h2>Sign in to play!</h2>
              <label>Username <input name="username" autoFocus={true} /></label>
              <label>Password <input name="password" /></label>
              <button className='landingPageButton' onClick={() => {verifySignin()}}>Sign in</button>
              <div>
                  <p>Don't have an account?</p>
                  <button className='landingPageButton' onClick={() => {setHasAccount(false)}}>Create one</button>
              </div>
          </div> :
          <div className='signin'>
              <h2>Create a new account</h2>
              <label>Choose a username <input name="newUsername" autoFocus={true} /></label>
              <label>Choose a password <input name="newPassword" /></label>
              <button className='landingPageButton' onClick={() => {verifyCreateAccount()}}>Create account</button>
              {/* TODO: button should check if username is already in DB, and if password isn't empty, then add account to DB */}
              <div>
                  <p>Already have an account?</p>
                  <button className='landingPageButton' onClick={() => {setHasAccount(true)}}>Sign in</button>
              </div>
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

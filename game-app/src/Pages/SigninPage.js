import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-modal'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {socket,socketPlayerIndex} from '../Socket';

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
      console.log("username is " + username + " password is " + password);
      {/* check if username/password combo is in DB, then call a flask endpoint to set the current account */}
      axios({
        method: "PUT",
        url:"http://localhost:5000/accounts/authenticate",
        data:{
            "Username": username,
            "Password": password
        } 
      })
      .then((response) => {
        console.log('PUT request successful:', response.data);
        if (Object.hasOwnProperty(response.data, 'message')) {
            toast('Invalid login, please try again', {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
                bodyClassName: "popup"
            });
        } else {
            toast.success('Login successful!', {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
                bodyClassName: "popup"
            });

            setJoinGameModalOpen(true);

            // Move the socket.emit inside the .then block
            console.log(username);
            socket.emit('connect_with_username', { username });
            socket.on('update_player_data', (data) => {
                console.log(data);
            
                             }
            );
            
              socket.on('reconnect', (data)=>{
                console.log("reconnect")
                
              });
        }
    })
    .catch((error) => {
        console.error('Error in PUT request:', error);
        // Handle the error as needed
    });
    
  }

  function verifyCreateAccount() {
      const username = document.querySelector('[name="newUsername"]').value;
      const password = document.querySelector('[name="newPassword"]').value;

      {/* check if username/password combo is in DB, then call a flask endpoint to set the current account */}
      axios({
        method: "POST",
        url:"http://localhost:5000/accounts/create-account",
        data:{
            "Username": username,
            "Password": password
        } 
      })
      .then((response) => {
        console.log('PUT request successful:', response.data);
        if(Object.hasOwn(response.data, 'message')){
            toast(response.data.message, {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
                bodyClassName: "popup"
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
                bodyClassName: "popup"
            });
            setHasAccount(true);
        }
    });
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
              <label>Username <input name="username" type='text' autoFocus={true} /></label>
              <label>Password <input name="password" type='password' /></label>
              <button className='landingPageButton' onClick={() => {verifySignin()}}>Sign in</button>
              <div>
                  <p>Don't have an account?</p>
                  <button className='landingPageButton' onClick={() => {setHasAccount(false)}}>Create one</button>
              </div>
          </div> :
          <div className='signin'>
              <h2>Create a new account</h2>
              <label>Choose a username <input name="newUsername" type='text' autoFocus={true} /></label>
              <label>Choose a password <input name="newPassword" type='password' /></label>
              <button className='landingPageButton' onClick={() => {verifyCreateAccount()}}>Create account</button>
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
            <Link to="/lobby"><button type='button'>Join</button></Link>
        </div>
    </Modal>
    </div>
  );
}

export default SigninPage;

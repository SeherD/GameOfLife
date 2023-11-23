import React from 'react'


function PlayerIcon(props) {

    return(
            <div className="playerIcon">
                {props.joined ? <img className="avatar" src={props.image} alt="player icon"></img> : <div className="waitingAvatar">Waiting...</div>}
            </div>
        )
}

export default PlayerIcon;
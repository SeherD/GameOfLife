import React, {Component} from 'react';
import Modal from 'react-modal'
import ModalContent from './ModalContent'
import Tile from './Tile';
import { getPlayerData, updatePlayerPosition, updatePlayerCareer, addPlayerHouse, addPlayerLanguage, updatePlayerCash } from './Players';
import Piece from './Piece';
import WheelComponent from 'react-wheel-of-prizes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class GameBoard extends Component{
    boardRef = React.createRef(); // used to get the left offset for the board - very hacky
    // used to access specific tiles by index
    tiles = Array.from({ length: 225 });
    state = {
            //arrays with indices for the grid to determine the type of tile
            emptyPoints: [209, 204, 194, 179, 178, 177, 176, 174, 145, 146, 147, 134, 104, 
            118, 117, 115, 99, 84, 85, 88, 24, 39, 8, 7, 20, 35, 2, 3, 16, 15, 48, 47, 45, 60, 75, 78, 79, 81,
            96, 97, 112, 126, 125, 123, 122, 157, 155, 154, 153, 169, 183, 182, 213, 214, 200],
            careerPoints: [89, 87, 49, 124],
            paydayPoints: [189, 159, 148, 86, 54, 4, 50, 30, 76, 142, 156, 137, 197],
            stopPoints: [175, 119, 5, 127, 184],
            startPoints: [224, 219],
            endPoints: [185],
            housePoints: [149, 69, 6, 80, 152],
            skillPoints: [144, 116, 114, 9, 17, 46, 77, 212, 215],
            // all the tiles that are valid player locations on the board, in the order that players will pass them
            // each player in this.state.players stores the path it's on and its position on the path (array index)
            path: {
                mainPath: [219, 204, 189, 174, 159, 144, 145, 146, 147, 148, 149, 134, 119, 118, 117, 116, 115, 114,
                99, 84, 69, 54, 39, 24, 9, 8, 7, 6, 5, 4, 3, 2, 17, 16, 15, 30, 45, 60, 75, 76, 77, 78, 79, 80, 81,
                96, 97, 112, 127, 142, 157, 156, 155, 154, 169, 184, 183, 182, 197, 212, 213, 214, 215, 200, 185],
                universityPath: [224, 209, 194, 179, 178, 177, 176, 175],
                sidePath1: [119, 104, 89, 88, 87, 86, 85],
                sidePath2: [5, 20, 35, 50, 49, 48, 47, 46],
                sidePath3: [127, 126, 125, 124, 123, 122, 137, 152, 153]
            },
            //properties for the spinner
            segments: ['1', '2', '3', '4', '5', '6'],
            segColors: ['#fcf910',
                        '#e93131',
                        '#b3da42',
                        '#28c3f3',
                        '#fa1da9',
                        '#ba38b4'
                        ],
            // player data
            players: getPlayerData(),
            currentPlayer: 0,
            playerPieces: [],
            // the number of pixels the board is offset from the left side of the page
            boardOffsetLeft: 0,
            // for tracking the initial path choice modal
            universityModalOpen: true,
            initialCareerModalOpen: false,
            // respin for chance to win a certification
            certSpin: false,
            cert: "",
            // respin for sale price of house
            houseSpin: false,
            houseToSell: ""
        }
    
    // used for determining boardOffsetLeft
    getBoardOffset = () => {
        const tileElement = this.boardRef.current;
        const rect = tileElement.getBoundingClientRect();
        this.setState({ boardOffsetLeft: rect.left });
    };

    componentDidMount() {
        this.getBoardOffset();
        
        this.updatePlayerPieces();
    }

    componentDidUpdate(prevProps, prevState) {
        // check if the state that affects the pieces has changed
        if (prevState.players !== this.state.players) {
          this.updatePlayerPieces();
        }
    }

    // cycle through the players in this.state.players
    updateCurrentPlayer = () => {
        if (this.state.currentPlayer === this.state.players.length - 1) {
            this.setState({
                currentPlayer: 0,
            });
        } else {
            this.setState((prevState) => ({
                currentPlayer: prevState.currentPlayer + 1,
            }));
        }
    }

    /**
     * updates the array of player pieces stored in the state
     * this array might not be necessary anymore. remove it?
     */
    updatePlayerPieces = () => {
        const playerPieces = this.state.players.map((player) => ({
          key: player.pid,
          color: player.color,
          tile: this.state.path[player.currentPath][player.position],
        }));
    
        this.setState({ playerPieces }, () => {
        });
    };

    handleModalClose = (slideIndex, newValue) => {
        const currentPlayer = this.state.players[this.state.currentPlayer];
        // if it's the beginning of the game (i.e. the current player isn't on a path yet)
        if (currentPlayer.currentPath === 'mainPath' && currentPlayer.position === 0) {
            // if player chose university path
            let newPath = null;
            if (slideIndex === 0) {
                newPath = 'universityPath';
                const newPosition = 0;
                let updatedPlayersArray = updatePlayerPosition(this.state.players, currentPlayer.pid, newPath, newPosition);
                updatedPlayersArray = updatePlayerCash(updatedPlayersArray, currentPlayer.pid, -100000);
                this.setState({players: updatedPlayersArray,},
                    () => {
                        this.updatePlayerPieces();
                        const newPlayerInfo = {
                            ...this.props.playerInfo,
                            cash: this.state.players[this.state.currentPlayer].cash,
                        };
                        this.props.updatePlayerInfo(newPlayerInfo);
                    }
                );
            } else {
                newPath = 'mainPath';
                this.setState({initialCareerModalOpen: true});
            }
        }
        // if currently on a career point
        if (this.state.careerPoints.includes(this.state.path[currentPlayer.currentPath][currentPlayer.position])) {
            this.setState(
                (prevState) => ({
                    players: updatePlayerCareer(prevState.players, currentPlayer.pid, newValue),
                }),
                () => {
                    this.updatePlayerPieces();
                    const newPlayerInfo = {
                        ...this.props.playerInfo,
                        career: newValue,
                        salary: this.state.players[this.state.currentPlayer].salary,
                        // TODO: call flask endpoint to find salary of new career and set player's salary
                    };
                    this.props.updatePlayerInfo(newPlayerInfo);
                }
            );
        }
        // if currently on a house point
        else if (this.state.housePoints.includes(this.state.path[currentPlayer.currentPath][currentPlayer.position])) {
            this.setState(
                (prevState) => ({
                    players: addPlayerHouse(prevState.players, currentPlayer.pid, newValue),
                }),
                () => {
                    this.updatePlayerPieces();
                }
            );
            const housesList = this.props.playerInfo.houses;
            housesList.push(newValue);
            console.log(housesList);
            const newPlayerInfo = {
                ...this.props.playerInfo,
                houses: housesList,
            };
            this.props.updatePlayerInfo(newPlayerInfo);
        }
        // if currently on tile 175 - graduation
        else if (currentPlayer.currentPath === 'universityPath' && currentPlayer.position === 7) {
            this.setState(
                (prevState) => ({
                    players: updatePlayerCareer(prevState.players, currentPlayer.pid, newValue),
                }),
                () => {
                    this.updatePlayerPieces();
                    const newPlayerInfo = {
                        ...this.props.playerInfo,
                        career: newValue,
                        salary: this.state.players[this.state.currentPlayer].salary,
                        // TODO: call flask endpoint to find salary of new career and set player's salary
                    };
                    this.props.updatePlayerInfo(newPlayerInfo);
                }
            );
        }
        // if currently on tile 119 - a stop point
        else if (currentPlayer.currentPath === 'mainPath' && currentPlayer.position === 12) {
            // if player chose side path
            if (slideIndex === 0) {
                const newPath = 'sidePath1';
                const newPosition = 0;
                this.setState(
                    (prevState) => ({
                        players: updatePlayerPosition(prevState.players, currentPlayer.pid, newPath, newPosition),
                    }),
                    () => {
                        this.updatePlayerPieces();
                    }
                );
            }
        }
        // if currently on tile 5 - a stop point
        else if (currentPlayer.currentPath === 'mainPath' && currentPlayer.position === 28) {
            // if player chose side path
            if (slideIndex === 0) {
                const newPath = 'sidePath2';
                const newPosition = 0;
                this.setState(
                    (prevState) => ({
                        players: updatePlayerPosition(prevState.players, currentPlayer.pid, newPath, newPosition),
                    }),
                    () => {
                        this.updatePlayerPieces();
                    }
                );
            }
        }
        // if currently on tile 127 - a stop point
        else if (currentPlayer.currentPath === 'mainPath' && currentPlayer.position === 48) {
            // if player chose side path
            if (slideIndex === 0) {
                const newPath = 'sidePath3';
                const newPosition = 0;
                this.setState(
                    (prevState) => ({
                        players: updatePlayerPosition(prevState.players, currentPlayer.pid, newPath, newPosition),
                    }),
                    () => {
                        this.updatePlayerPieces();
                    }
                );
            }
        }
        // if currently on tile 184 - a stop point
        else if (currentPlayer.currentPath === 'mainPath' && currentPlayer.position === 55) {
            // if player chose to retire early
            if (slideIndex === 0) {
                const newPath = 'mainPath';
                const newPosition = 64;
                this.setState(
                    (prevState) => ({
                        players: updatePlayerPosition(prevState.players, currentPlayer.pid, newPath, newPosition),
                    }),
                    () => {
                        this.updatePlayerPieces();
                    }
                );
            }
        }
    };

    handleTile = (onPath, atPosition) => {
        const index = this.state.path[onPath][atPosition];
        console.log(`player ${this.state.currentPlayer} is now on tile ${index}`);
        const tile = this.tiles[index];
        const newValue = tile.handleClick(this.state.players[this.state.currentPlayer]);
        // if handleClick returned a value
        if (newValue) {
            // if that value is a string, it is a new skill
            if (newValue instanceof String) {
                this.setState(
                    (prevState) => ({
                        players: addPlayerLanguage(prevState.players, this.state.currentPlayer, newValue),
                    }),
                    () => {
                        this.updatePlayerPieces();
                        const languagesList = this.props.playerInfo.languages;
                        languagesList.push(newValue);
                        console.log(languagesList);
                        const newPlayerInfo = {
                            ...this.props.playerInfo,
                            languagesList: languagesList,
                        };
                        this.props.updatePlayerInfo(newPlayerInfo);
                    }
                );
            // if the returned value is a number, it is 2 * the player's salary
            } else {
                // TODO: call a flask endpoint to add newValue to the player's cash
                this.setState(
                    (prevState) => ({
                        players: updatePlayerCash(prevState.players, this.state.currentPlayer, newValue),
                    }),
                    () => {
                        console.log(this.state.players[this.state.currentPlayer]);
                        this.updatePlayerPieces();
                        const newPlayerInfo = {
                            ...this.props.playerInfo,
                            cash: this.state.players[this.state.currentPlayer].cash,
                        };
                        this.props.updatePlayerInfo(newPlayerInfo);
                    }
                )
            }
        }
    }

    calculateNewPosition = (currentPath, currentPosition, increment) => {
        // calculate a tentative new position by increasing the position by the result of the spinner
        const tempPosition = parseInt(currentPosition) + parseInt(increment);
        let newPath = currentPath;
        let newPosition = tempPosition;
        const path = this.state.path;
        const tilesPassed = path[currentPath].slice(currentPosition+1, newPosition);
        // if the player finishes a side path, merge into the main path
        if (currentPath === "universityPath" && tempPosition >= path[currentPath].length) {
            newPath = "mainPath";
            newPosition = 3 + tempPosition - path[currentPath].length;
            tilesPassed.push.apply(tilesPassed, path[newPath].slice(3,newPosition));
        } else if (currentPath === "sidePath1" && tempPosition >= path[currentPath].length) {
            newPath = "mainPath";
            newPosition = 19 + tempPosition - path[currentPath].length;
            tilesPassed.push.apply(tilesPassed, path[newPath].slice(19,newPosition));
        } else if (currentPath === "sidePath2" && tempPosition >= path[currentPath].length) {
            newPath = "mainPath";
            newPosition = 36 + tempPosition - path[currentPath].length;
            tilesPassed.push.apply(tilesPassed, path[newPath].slice(36,newPosition));
        } else if (currentPath === "sidePath3" && tempPosition >= path[currentPath].length) {
            newPath = "mainPath";
            newPosition = 53 + tempPosition - path[currentPath].length;
            tilesPassed.push.apply(tilesPassed, path[newPath].slice(53,newPosition));
        }

        // check if the player is passing any stop tiles or reaching the end of the board
        console.log("Tiles passed:", tilesPassed);
        for (let tile of tilesPassed) {
            // stop for stop tiles
            if (this.state.stopPoints.includes(tile)) {
                newPosition = path[currentPath].indexOf(tile);
                if (currentPath === "universityPath") newPath = "universityPath";
                break;
            // receive salary when passing payday tiles
            } else if (this.state.paydayPoints.includes(tile)) {
                console.log("passing a payday");
                const salary = this.state.players[this.state.currentPlayer].salary;
                // TODO: call a flask endpoint to add the player's salary to their cash
                this.setState(
                    (prevState) => ({
                        players: updatePlayerCash(prevState.players, this.state.currentPlayer, salary),
                    }),
                    () => {
                        console.log(this.state.players[this.state.currentPlayer]);
                        this.updatePlayerPieces();
                        const newPlayerInfo = {
                            ...this.props.playerInfo,
                            cash: this.state.players[this.state.currentPlayer].cash,
                        };
                        this.props.updatePlayerInfo(newPlayerInfo);
                    }
                )
            }
            // end on retirement tile
            if (this.state.endPoints.includes(tile)) newPosition = path["mainPath"].indexOf(tile);
        };     

        return [newPath, newPosition];
    }

    //update respin and certification state when player chooses to spin for risky skill
    handleRisk = (certification) =>{
        toast('Spin again to see if you passed the certification!', {
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
        this.setState({cert: certification, certSpin: true})
    }

    handleSale = (house) => {
        toast('Spin again to see whether the price of the house went up or down!', {
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
        this.setState({houseToSell: house, houseSpin: true})
    }

    handleInitialCareerModalClose = (slideIndex, newCareer) => {
        this.setState(
            (prevState) => ({
                players: updatePlayerCareer(prevState.players, this.state.currentPlayer, newCareer),
            }),
            () => {
                this.updatePlayerPieces();
                const newPlayerInfo = {
                    ...this.props.playerInfo,
                    career: newCareer,
                    salary: this.state.players[this.state.currentPlayer].salary,
                    // TODO: call flask endpoint to find salary of new career and set player's salary
                };
                this.props.updatePlayerInfo(newPlayerInfo);
            }
        );
    }
   
    //function that is called after the spinner is done spinning
    onFinished = (winner) => {
        
        const currentPlayer = this.state.players.find(player => player.pid === this.state.currentPlayer);
        const currentPath = currentPlayer.currentPath;
        const currentPosition = currentPlayer.position;
        // If the player is spinning to determine the sale price of a house
        if(this.state.houseSpin){
            if(this.state.housePoints.includes(this.state.path[currentPath][currentPosition])){
                // TODO: call flask endpoint to get the original price of the house - let salePrice = this value
                if(winner % 2 === 0){
                    toast('The price of your house went up!', {
                        position: "top-center",
                        autoClose: 2500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "dark",
                    });
                    // TODO: increase the price of the house by 20K
                }else {
                    toast('The price of your house went down!', {
                        position: "top-center",
                        autoClose: 2500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "dark",
                    });
                    // TODO: decrease the price of the house by 20K
                }
                //TODO: call flask endpoint to remove this.state.houseToSell from player assets
                // TODO: call flask endpoint to add salePrice to player assets
                this.setState({houseSpin: false, houseToSell: ""});
            }
        // If the player is spinning to determine if they get a certification
        } else if(this.state.certSpin){
            if(this.state.skillPoints.includes(this.state.path[currentPath][currentPosition])){
                if(winner % 2 === 0){
                    //TODO: call flask endpoint to add this.state.cert to player assets
                    toast.success('You passed the certification!', {
                        position: "top-center",
                        autoClose: 2500,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "dark",
                        });

                }else {
                    toast('You did not pass the certification!', {
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
                this.setState({certSpin: false, cert: ""});
            }
        } else {
        const newPathAndPosition = this.calculateNewPosition(currentPath, currentPosition, winner);
        const newPath = newPathAndPosition[0];
        const newPosition = newPathAndPosition[1];

        this.setState({players: updatePlayerPosition(this.state.players, currentPlayer.pid, newPath, newPosition)});
        console.log(`new path: ${newPath}, new position: ${newPosition}`);
        this.handleTile(newPath, newPosition);
        this.updateCurrentPlayer();
        }
      }  

    //create game board
    createBoard = () =>{
        //create 15 by 15 grid
        return (
            <div>
                {Array.from({ length: 15 }).map((_, rowIndex) => (
                    <div className ='boardRow' key={rowIndex}>
                        {Array.from({ length: 15 }).map((_, colIndex) => {
                            //loop through all of the indices and check if they are associated with any 
                            //specific tile type then create that type otherwise create a green empty tile 
                            //representing the background of the board
                            var num = rowIndex*15 + colIndex;
                            if(this.state.careerPoints.includes(num)){
                                return <Tile
                                    onModalClose = {this.handleModalClose}
                                    key = {num}
                                    color = {"purple"}
                                    word = {"Career"}
                                    ref = { (ref) => (this.tiles[(rowIndex*15)+colIndex] = ref)} />
                            } else if(this.state.emptyPoints.includes(num)){
                                return <Tile
                                    onModalClose = {this.handleModalClose}
                                    key = {num} 
                                    color = {"yellow"}
                                    word = {""}
                                    ref = { (ref) => (this.tiles[(rowIndex*15)+colIndex] = ref)} />
                            } else if(this.state.paydayPoints.includes(num)){
                                return <Tile
                                    onModalClose = {this.handleModalClose}
                                    key = {num} 
                                    color = {"darkgreen"}
                                    word = {"PayDay"}
                                    ref = { (ref) => (this.tiles[(rowIndex*15)+colIndex] = ref)} />
                            } else if(this.state.stopPoints.includes(num)){
                                return <Tile
                                    onModalClose = {this.handleModalClose}
                                    key = {num} 
                                    color = {"red"}
                                    word = {"STOP"}
                                    stopID = {num}
                                    ref = { (ref) => (this.tiles[(rowIndex*15)+colIndex] = ref)} />
                            } else if(this.state.startPoints.includes(num)){
                                return <Tile
                                    onModalClose = {this.handleModalClose}
                                    key = {num} 
                                    color = {"orange"}
                                    word = {"Start"}
                                    ref = { (ref) => (this.tiles[(rowIndex*15)+colIndex] = ref)} />
                            } else if(this.state.endPoints.includes(num)){
                                return <Tile
                                    onModalClose = {this.handleModalClose}
                                    key = {num} 
                                    color = {"orange"}
                                    word = {"Retirement!"}
                                    ref = { (ref) => (this.tiles[(rowIndex*15)+colIndex] = ref)} />
                            } else if(this.state.housePoints.includes(num)){
                                return <Tile
                                    onModalClose = {this.handleSale}
                                    key = {num} 
                                    color = {"blue"}
                                    word = {"House"}
                                    ref = { (ref) => (this.tiles[(rowIndex*15)+colIndex] = ref)} />
                            } else if(this.state.skillPoints.includes(num)){
                                return <Tile
                                    onModalClose = {this.handleRisk}
                                    key = {num} 
                                    color = {"#fb3199"}
                                    word = {"Skills"}
                                    ref = { (ref) => (this.tiles[(rowIndex*15)+colIndex] = ref)} />
                            } else {
                                return <Tile
                                    key = {num} 
                                    color = {"green"}
                                    word = {""} />
                            }
                        })}
                    </div>
                ))}
                {/* place a piece for each element in this.state.playerPieces */}
                {this.state.playerPieces.map((player) => (
                    <Piece
                        key={player.key}
                        color={player.color}
                        tile={player.tile}
                        boardOffsetLeft={this.state.boardOffsetLeft}
                    />
                ))}
            </div>
        );
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
        <ToastContainer/>
            {/* used for determining boardOffsetLeft */}
            <div ref={this.boardRef} style={{ position: 'absolute', top: '-9999px' }} />
            {/* game board */}
            <div className='board'>
                {this.createBoard()}
                <div className='spinner'>
                    <WheelComponent
                        segments={this.state.segments}
                        segColors={this.state.segColors}
                        onFinished={(winner) => this.onFinished(winner)}
                        isOnlyOnce={false}
                        downDuration={500} />
                </div>
            </div> 
            {/* modal for choosing initial path - open at beginning of game */}
            <div>
                <Modal
                    ariaHideApp={false}
                    isOpen = {this.state.universityModalOpen}
                    onRequestClose={() => this.setState({universityModalOpen: false})}
                    shouldCloseOnEsc={false}
                    shouldCloseOnOverlayClick={false}
                    style={customStyles}>
                    <ModalContent type={"University"} handleClose={() => this.setState({universityModalOpen: false})} onModalClose={this.handleModalClose} />
                </Modal>
            </div>
            {/* modal for choosing initial career if player begins on bootcamp path */}
            <div>
                <Modal
                    ariaHideApp={false}
                    isOpen = {this.state.initialCareerModalOpen}
                    onRequestClose={() => this.setState({initialCareerModalOpen: false})}
                    shouldCloseOnEsc={false}
                    shouldCloseOnOverlayClick={false}
                    style={customStyles}>
                    <ModalContent type={"Career"} handleClose={() => this.setState({initialCareerModalOpen: false})} onModalClose={this.handleInitialCareerModalClose} />
                </Modal>
            </div>
        </div>
    );}
}
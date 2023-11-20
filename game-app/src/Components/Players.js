export const getPlayerData = () => {
    return [
        { pid: 0, currentPath: "mainPath", position: 0, color: 'pink' },
    ]
};

export const updatePlayerPosition = (players, playerID, newPath, newPosition) => {
    return players.map((player) => 
        player.pid === playerID ? {...player, currentPath: newPath, position: newPosition} : player
        );
};

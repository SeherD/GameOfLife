export const getPlayerData = () => {
    return [
        { pid: 0, currentPath: "mainPath", position: 0, career: "Barista", balance: 0, languages: ["Java","Python"], houses: [], color: 'pink' },
    ]
};

export const updatePlayerPosition = (players, playerID, newPath, newPosition) => {
    return players.map((player) => 
        player.pid === playerID ? {...player, currentPath: newPath, position: newPosition} : player
        );
};

export const updatePlayerCareer = (players, playerID, newCareer) => {
    return players.map((player) =>
    player.pid === playerID ? {...player, career: newCareer} : player
    );
};

export const updatePlayerBalance = (players, playerID, balanceChange) => {
    return players.map((player) =>
    player.pid === playerID ? {...player, balance: player.balance + balanceChange} : player
    );
};

export const addPlayerLanguage = (players, playerID, language) => {
    return players.map((player) =>
    player.pid === playerID ? {...player, languages: [...player.languages, language]} : player
    );
};

export const addPlayerHouse = (players, playerID, house) => {
    return players.map((player) =>
    player.pid === playerID ? {...player, houses: [...player.houses, house]} : player
    );
};

export const removePlayerHouse = (players, playerID, house) => {
    return players.map((player) =>
    player.pid === playerID ? {...player, houses: player.houses.filter(h => h !== house)} : player
    );
};

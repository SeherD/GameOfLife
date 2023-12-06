CREATE TABLE CareerCards (
    CareerID TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Salary REAL,
    University_Required BOOLEAN,
    Image TEXT,
    Used BOOLEAN
);



CREATE TABLE HouseCards (
    HouseID TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Cost INTEGER,
    Image TEXT,
    Used BOOLEAN
);


CREATE TABLE Players (
    PlayerID TEXT PRIMARY KEY,
    Money REAL,
    Debt REAL,
    CareerID TEXT,
    ColorOfPiece TEXT UNIQUE,
    Avatar TEXT UNIQUE,
    University BOOLEAN,
    Host BOOLEAN,
    Homes TEXT,
    Languages TEXT,
    Stocks TEXT,
    Salary REAL,
    Location REAL,
    Path TEXT
);

CREATE TRIGGER enforce_max_players
BEFORE INSERT ON Players
BEGIN
    SELECT CASE
        WHEN (SELECT COUNT(*) FROM Players) >= 5
        THEN
            RAISE(ABORT, 'Exceeded maximum number of players (5)')
    END;
END;



CREATE TABLE Games (
    GameID TEXT PRIMARY KEY,
    BoardState TEXT,
    HostID TEXT,
    Players TEXT,
    Finished BOOLEAN
);



CREATE TABLE Accounts (
    Username TEXT PRIMARY KEY,
    Password TEXT
);



CREATE TABLE UserData (
    UserID TEXT PRIMARY KEY,
    PlayerName TEXT,
    HighestScore REAL,
    AccountIDs TEXT
);


CREATE TABLE Certifications (
    CertID TEXT PRIMARY KEY,
    CertName TEXT,
    IsCert BOOLEAN,
    Image TEXT
);

CREATE TABLE UserPlayer (
    PlayerID TEXT PRIMARY KEY,
    Username TEXT UNIQUE
);

CREATE TABLE CareerCards (
    CareerID TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Salary REAL,
    University_Required BOOLEAN,
    Image TEXT,
    Used BOOLEAN
);

INSERT INTO CareerCards (CareerID, Name, Salary, University_Required, Image, Used) VALUES
('C1', 'Web Developer', 80000, 0, 'image1.jpg', 0),
('C2', 'ChatGPT Prompter', 60000, 0, 'image2.jpg', 0),
('C3', 'Quality Assurance Specialist', 85000, 0, 'image3.jpg', 0),
('C4', 'Hacker', 80000, 0, 'image4.jpg', 0),
('C5', 'Machine Learning Engineer', 90000, 1, 'image5.jpg', 0),
('C6', 'Full Stack Developer', 80000, 1, 'image1.jpg', 0),
('C7', 'System Administrator', 105000, 1, 'image2.jpg', 0),
('C8', 'Technical Consultant', 95000, 1, 'image3.jpg', 0),
('C9', 'Software Development Engineer', 90000, 0, 'image4.jpg', 0),
('C10', 'Data Analyst', 90000, 1, 'image5.jpg', 0),
('C11', 'Database Administrator', 150000, 1, 'image1.jpg', 0),
('C12', 'AI Specialist', 120000, 1, 'image2.jpg', 0),
('C13', 'Technical Writer', 70000, 0, 'image3.jpg', 0),
('C14', 'Cybersecurity Specialist', 100000, 1, 'image4.jpg', 0),
('C15', 'GPU Libraries Software Engineer', 120000, 1, 'image5.jpg', 0);


-- Create HouseCards table
CREATE TABLE HouseCards (
    HouseID TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Cost INTEGER,
    Image TEXT,
    Used BOOLEAN
);

-- Insert 15 HouseCards
INSERT INTO HouseCards (HouseID, Name, Cost, Image, Used) VALUES
('H1', 'Cozy Cottage', 50000, 'cottage.jpg', 0),
('H2', 'Modern Apartment', 80000, 'apartment.jpg', 0),
('H3', 'Spacious Villa', 150000, 'villa.jpg', 0),
('H4', 'Beach House', 200000, 'beach_house.jpg', 0),
('H5', 'Mountain Retreat', 120000, 'mountain_retreat.jpg', 0),
('H6', 'City Penthouse', 250000, 'penthouse.jpg', 0),
('H7', 'Country Farmhouse', 100000, 'farmhouse.jpg', 0),
('H8', 'Suburban Bungalow', 90000, 'bungalow.jpg', 0),
('H9', 'Rural Cabin', 70000, 'cabin.jpg', 0),
('H10', 'Luxury Mansion', 500000, 'mansion.jpg', 0),
('H11', 'Treehouse Retreat', 60000, 'treehouse.jpg', 0),
('H12', 'Lakefront Cottage', 130000, 'lakefront_cottage.jpg', 0),
('H13', 'Skyline Loft', 180000, 'loft.jpg', 0),
('H14', 'Historic Manor', 220000, 'manor.jpg', 0),
('H15', 'Desert Oasis', 160000, 'desert_oasis.jpg', 0);



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
    Salary REAL
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


-- Inserting 5 players
INSERT INTO Players (PlayerID, Money, Debt, CareerID, ColorOfPiece, Avatar, University, Host, Homes, Languages, Stocks)
VALUES
    ('P1', 10000, 0, 'C1', 'Red', 'Avatar1', 0, 0, 'H1,H2', 'Python,Java', 'AAPL,GOOGL', 0),
    ('P2', 15000, 500, 'C2', 'Blue', 'Avatar2', 0, 1, 'H3,H4', 'C++,JavaScript', 'MSFT,AMZN', 0),
    ('P3', 20000, 1000, 'C3', 'Green', 'Avatar3', 1, 0, 'H5,H6', 'Java,Python', 'AAPL,GOOGL',0),
    ('P4', 25000, 1500, 'C4', 'Yellow', 'Avatar4', 0, 0, 'H7,H8', 'JavaScript,Python', 'MSFT,AMZN', 0),
    ('P5', 30000, 2000, 'C5', 'Purple', 'Avatar5', 1, 0, 'H9,H10', 'Python,C++', 'AAPL,GOOGL',0);



CREATE TABLE Games (
    GameID TEXT PRIMARY KEY,
    BoardState TEXT,
    HostID TEXT,
    Players TEXT,
    Finished BOOLEAN
);


INSERT INTO Games (GameID, BoardState, HostID, Players, Finished)
VALUES
    ('G1', 'Cell7, Cell8, Cell21, Cell4, Cell9', 'P1', 'P1,P2,P3,P4,P5', 0);
    



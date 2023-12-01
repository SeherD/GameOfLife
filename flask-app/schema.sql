CREATE TABLE CareerCards (
    CareerID TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Salary REAL,
    University_Required BOOLEAN,
    Image TEXT,
    Used BOOLEAN
);

INSERT INTO CareerCards (CareerID, Name, Salary, University_Required, Image, Used) VALUES
('C1', 'Web Developer', 80000, 0, '../game-app/src/assets/Careers/webdev.jpg', 0),
('C2', 'ChatGPT Prompter', 60000, 0, '../game-app/src/assets/Careers/gptprompter.jpg', 0),
('C3', 'Quality Assurance Specialist', 85000, 0, '../game-app/src/assets/Careers/qa.jpg', 0),
('C4', 'Hacker', 80000, 0, '../game-app/src/assets/Careers/hacker.jpg', 0),
('C5', 'Machine Learning Engineer', 90000, 1, '../game-app/src/assets/Careers/machine_engineer.jpg', 0),
('C6', 'Full Stack Developer', 80000, 1, '../game-app/src/assets/Careers/fullstack.jpg', 0),
('C7', 'System Administrator', 105000, 1, '../game-app/src/assets/Careers/sysadmin.jpg', 0),
('C8', 'Technical Consultant', 95000, 1, '../game-app/src/assets/Careers/consultant.jpg', 0),
('C9', 'Software Development Engineer', 90000, 0, '../game-app/src/assets/Careers/sde.jpg', 0),
('C10', 'Data Analyst', 90000, 1, '../game-app/src/assets/Careers/dataanalyst.jpg', 0),
('C11', 'Database Administrator', 150000, 1, '../game-app/src/assets/Careers/databaseadmin.jpg', 0),
('C12', 'AI Specialist', 120000, 1, '../game-app/src/assets/Careers/ai_special.jpg', 0),
('C13', 'Technical Writer', 70000, 0, '../game-app/src/assets/Careers/techwriter.jpg', 0),
('C14', 'Cybersecurity Specialist', 100000, 1, '../game-app/src/assets/Careers/cyber.jpg', 0),
('C15', 'GPU Libraries Software Engineer', 120000, 1, '../game-app/src/assets/Careers/gpu.jpg', 0);



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
('H1', 'Cozy Cottage', 50000, '../game-app/src/assets/Houses/cottage.jpg', 0),
('H2', 'Modern Apartment', 80000, '../game-app/src/assets/Houses/apartment.jpg', 0),
('H3', 'Spacious Villa', 150000, '../game-app/src/assets/Houses/villa.jpg', 0),
('H4', 'Beach House', 200000, '../game-app/src/assets/Houses/beach_house.jpg', 0),
('H5', 'Mountain Retreat', 120000, '../game-app/src/assets/Houses/mountain_retreat.jpg', 0),
('H6', 'City Penthouse', 250000, '../game-app/src/assets/Houses/penthouse.jpg', 0),
('H7', 'Country Farmhouse', 100000, '../game-app/src/assets/Houses/farmhouse.jpg', 0),
('H8', 'Suburban Bungalow', 90000, '../game-app/src/assets/Houses/bungalow.jpg', 0),
('H9', 'Rural Cabin', 70000, '../game-app/src/assets/Houses/cabin.jpg', 0),
('H10', 'Luxury Mansion', 500000, '../game-app/src/assets/Houses/mansion.jpg', 0),
('H11', 'Treehouse Retreat', 60000, '../game-app/src/assets/Houses/treehouse.jpg', 0),
('H12', 'Lakefront Cottage', 130000, '../game-app/src/assets/Houses/lakefront.jpg', 0),
('H13', 'Skyline Loft', 180000, '../game-app/src/assets/Houses/loft.jpg', 0),
('H14', 'Historic Manor', 220000, '../game-app/src/assets/Houses/manor.jpg', 0),
('H15', 'Desert Oasis', 160000, '../game-app/src/assets/Houses/desert_oasis.jpg', 0);





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


-- Inserting 5 players
INSERT INTO Players (PlayerID, Money, Debt, CareerID, ColorOfPiece, Avatar, University, Host, Homes, Languages, Stocks, Salary, Location, Path)
VALUES
    ('P1', 200000, 0, '', 'Red', 'Avatar1', 0, 1, '', '', '', 0, 0, 'mainPath'),
    ('P2', 200000, 0, '', 'Blue', 'Avatar2', 0, 0, '', '', '', 0, 0, 'mainPath'),
    ('P3', 200000, 0, '', 'Green', 'Avatar3', 0, 0, '', '', '',0, 0, 'mainPath'),
    ('P4', 200000, 0, '', 'Yellow', 'Avatar4', 0, 0, '', '', '', 0, 0, 'mainPath'),
    ('P5', 200000, 0, '', 'Purple', 'Avatar5', 0, 0, '', '', '', 0, 0, 'mainPath');



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

-- Create accounts    
CREATE TABLE Accounts (
    AccountID TEXT PRIMARY KEY,
    Username TEXT,
    Password TEXT,
    FirstName TEXT,
    LastName TEXT
);

INSERT INTO Accounts (AccountID, Username, Password, FirstName, LastName)
VALUES
    ('A1', 'bestLifeGamePlayer2000', 'thisShouldBeSHA256d', 'Alice', 'Bob'),
    ('A2', 'bestLifeGamePlayer2001', 'thisShouldBeSHA512d', 'Alice', 'Bob');


-- Create user account data
CREATE TABLE UserData (
    UserID TEXT PRIMARY KEY,
    PlayerName TEXT,
    HighestScore REAL,
    AccountIDs TEXT
);

INSERT INTO UserData (UserID, PlayerName, HighestScore, AccountIDs)
VALUES
    ('UD1', 'bestLifeGamePlayer2000', 1500000, 'A1,A2');

-- Create languages and certifications table
CREATE TABLE Certifications (
    CertID TEXT PRIMARY KEY,
    CertName TEXT,
    IsCert BOOLEAN,
    Image TEXT
);

INSERT INTO Certifications (CertID, CertName, IsCert, Image)
VALUES
    ('L1', 'Python', 0, '../game-app/src/assets/Languages/python.png'),
    ('L2', 'C++', 0, '../game-app/src/assets/Languages/cpp.png'),
    ('L3', 'JavaScript', 0, '../game-app/src/assets/Languages/js.png'),
    ('L4', 'Java', 0, '../game-app/src/assets/Languages/java.png'),
    ('L5', 'HTML & CSS', 0, '../game-app/src/assets/Languages/html.png'),
    ('L6', 'Assembly', 0, '../game-app/src/assets/Languages/assembly.png'),
    ('L7', 'C', 0, '../game-app/src/assets/Languages/c.png'),
    ('L8', 'Swift', 0, '../game-app/src/assets/Languages/swift.png'),
    ('L9', 'R', 0, '../game-app/src/assets/Languages/r.png'),
    ('L10', 'Microsoft Azure', 1, '../game-app/src/assets/Languages/azure.png'),
    ('L11', 'Oracle Java SE', 1, '../game-app/src/assets/Languages/java_se.png'),
    ('L12', 'Amazon Web Services', 1, '../game-app/src/assets/Languages/aws.png'),
    ('L13', 'Microsoft Office Suite', 1, '../game-app/src/assets/Languages/office.png'),
    ('L14', 'Cisco Networks', 1, '../game-app/src/assets/Languages/cisco.png'),
    ('L15', 'LinkedIn Proficiency', 1, '../game-app/src/assets/Languages/linkedin.png'),
    ('L16', 'IBM Machine Learning', 1, '../game-app/src/assets/Languages/ibm_ml.png'),
    ('L17', 'Hackathon 1st Place', 1, '../game-app/src/assets/Languages/hackathon.png'),
    ('L18', 'Salesforce', 1, '../game-app/src/assets/Languages/salesforce.png'),
    ('L19', 'Certified Internet Webmaster (CIW)', 1, '../game-app/src/assets/Languages/ciw.png'),
    ('L20', 'Information Systems Security Professional', 1, '../game-app/src/assets/Languages/security_professional.png');


from flask import Flask, g
from flask_restful import Resource, Api
import sqlite3
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)

CORS(app)

socketio = SocketIO(
    app, cors_allowed_origins="*", namespace="/"
)  # Adjust the origins as needed

DATABASE = "game_of_life.db"


def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource("schema.sql", mode="r") as f:
            db.cursor().executescript(f.read())
        db.commit()


@app.cli.command("initdb")
def initdb_command():
    init_db()
    print("Initialized the database.")


@app.route("/")
def index():
    return "Hello, World!"


def initialize_game_data():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()

        # Delete existing values in the Players table
        cursor.execute("DELETE FROM Players")

        # Delete existing values in the CareerCards table
        cursor.execute("DELETE FROM CareerCards")

        # Delete existing values in the HouseCards table
        cursor.execute("DELETE FROM HouseCards")

        # Delete existing values in the Certifications table
        cursor.execute("DELETE FROM Certifications")

        cursor.execute("DELETE FROM UserPlayer")

        # Commit the changes
        db.commit()

        # Insert initial data into the HouseCards table
        cursor.executescript(
            """
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
('H12', 'Lakefront Cottage', 130000, 'lakefront.jpg', 0),
('H13', 'Skyline Loft', 180000, 'loft.jpg', 0),
('H14', 'Historic Manor', 220000, 'manor.jpg', 0),
('H15', 'Desert Oasis', 160000, 'desert_oasis.jpg', 0);
        """
        )

        # Insert initial data into the CareerCards table
        cursor.executescript(
            """
            INSERT INTO CareerCards (CareerID, Name, Salary, University_Required, Image, Used) VALUES
('C1', 'Web Developer', 80000, 0, 'webdev.jpg', 0),
('C2', 'ChatGPT Prompter', 60000, 0, 'gptprompter.jpg', 0),
('C3', 'Quality Assurance Specialist', 85000, 0, 'qa.jpg', 0),
('C4', 'Hacker', 80000, 0, 'hacker.jpg', 0),
('C5', 'Machine Learning Engineer', 90000, 1, 'machine_engineer.jpg', 0),
('C6', 'Full Stack Developer', 80000, 1, 'fullstack.jpg', 0),
('C7', 'System Administrator', 105000, 1, 'sysadmin.jpg', 0),
('C8', 'Technical Consultant', 95000, 1, 'consultant.jpg', 0),
('C9', 'Software Development Engineer', 90000, 0, 'sde.jpg', 0),
('C10', 'Data Analyst', 90000, 1, 'dataanalyst.jpg', 0),
('C11', 'Database Administrator', 150000, 1, 'databaseadmin.jpg', 0),
('C12', 'AI Specialist', 120000, 1, 'ai_special.jpg', 0),
('C13', 'Technical Writer', 70000, 0, 'techwriter.jpg', 0),
('C14', 'Cybersecurity Specialist', 100000, 1, 'cyber.jpg', 0),
('C15', 'GPU Libraries Software Engineer', 120000, 1, 'gpu.jpg', 0);
        """
        )

        # Insert initial data into the Certifications table
        cursor.executescript(
            """
            INSERT INTO Certifications (CertID, CertName, IsCert, Image)
VALUES
    ('L1', 'Python', 0, 'python.png'),
    ('L2', 'C++', 0, 'cpp.png'),
    ('L3', 'JavaScript', 0, 'js.png'),
    ('L4', 'Java', 0, 'java.png'),
    ('L5', 'HTML & CSS', 0, 'html.png'),
    ('L6', 'Assembly', 0, 'assembly.png'),
    ('L7', 'C', 0, 'c.png'),
    ('L8', 'Swift', 0, 'swift.png'),
    ('L9', 'R', 0, 'r.png'),
    ('L10', 'Microsoft Azure', 1, 'azure.png'),
    ('L11', 'Oracle Java SE', 1, 'java_se.png'),
    ('L12', 'Amazon Web Services', 1, 'aws.png'),
    ('L13', 'Microsoft Office Suite', 1, 'office.png'),
    ('L14', 'Cisco Networks', 1, 'cisco.png'),
    ('L15', 'LinkedIn Proficiency', 1, 'linkedin.png'),
    ('L16', 'IBM Machine Learning', 1, 'ibm_ml.png'),
    ('L17', 'Hackathon 1st Place', 1, 'hackathon.png'),
    ('L18', 'Salesforce', 1, 'salesforce.png'),
    ('L19', 'Certified Internet Webmaster (CIW)', 1, 'ciw.png'),
    ('L20', 'Information Systems Security Professional', 1, 'security_professional.png');
        """
        )

        # Commit the changes
        db.commit()


# Example usage to initialize game data
# initialize_game_data()

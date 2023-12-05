from flask import Flask, request
from flask_restful import Api, Resource, reqparse
from database_init import *
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room

parser = reqparse.RequestParser()
parser.add_argument("PlayerID", type=str, required=True)
parser.add_argument("Money", type=float, required=True)
parser.add_argument("Debt", type=float, required=True)
parser.add_argument("CareerID", type=str, required=True)
parser.add_argument("ColorOfPiece", type=str, required=True)
parser.add_argument("Avatar", type=str, required=True)
parser.add_argument("University", type=bool, default=False)
parser.add_argument("Host", type=bool, default=False)
parser.add_argument("Homes", type=str, default=[])
parser.add_argument("Languages", type=str, default=[])
parser.add_argument("Stocks", type=str, default=[])
parser.add_argument("Salary", type=float, required=True)
parser.add_argument("Location", type=int, default=0)
parser.add_argument("Path", type=str, default="mainPath")


def get_career_title(career_id):
    # Replace 'your_database_file.db' with the actual path to your SQLite database file
    db = get_db()
    # Establish a connection to the database

    cursor = db.cursor()

    # Execute a query to fetch the career title based on the career ID
    cursor.execute("SELECT Name FROM CareerCards WHERE CareerID = ?", (career_id,))

    # Fetch the result
    result = cursor.fetchone()

    # Close the database connection

    # Return the career title if found, otherwise return None
    return result[0] if result else None


def get_house_title(house_id):
    # Replace 'your_database_file.db' with the actual path to your SQLite database file
    db = get_db()
    # Establish a connection to the database

    cursor = db.cursor()

    # Execute a query to fetch the career title based on the career ID
    cursor.execute("SELECT Name FROM HouseCards WHERE HouseID = ?", (house_id,))

    # Fetch the result
    result = cursor.fetchone()

    # Close the database connection

    # Return the career title if found, otherwise return None
    return result[0] if result else None


def get_language_title(lang_id):
    # Replace 'your_database_file.db' with the actual path to your SQLite database file
    db = get_db()
    cursor = db.cursor()

    # Execute a query to fetch the language name based on the language ID
    cursor.execute("SELECT CertName FROM Certifications WHERE CertID = ?", (lang_id,))

    # Fetch the result
    result = cursor.fetchone()

    # Close the database connection
    return result[0] if result else None


def format_player_response(player_data):
    print(player_data)
    career_id = player_data[3]
    career_title = get_career_title(career_id)

    # Convert house IDs to names
    house_ids = player_data[8].split(",") if player_data[8] else []
    house_names = [get_house_title(h_id) for h_id in house_ids]

    # Convert language IDs to names
    language_ids = player_data[9].split(",") if player_data[9] else []
    language_names = [get_language_title(lang_id) for lang_id in language_ids]

    return {
        "playerid": player_data[0],
        "image": player_data[5],  # Assuming 'Avatar' corresponds to the player's image
        "career": career_title,
        "cash": player_data[1],  # Assuming 'Money' corresponds to the player's cash
        "salary": player_data[11],
        "languages": language_names,
        "houses": house_names,
        "color": player_data[4],  # Assuming 'ColorOfPiece' corresponds to the player's color
        "path": player_data[13],  # Using the 'Path' variable from player data
        "location": player_data[12],  # Using the 'Location' variable from player data
    }


class IndividualPlayerResource(Resource):
    def get(self, player_id):
        db = get_db()
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        player = cur.fetchone()
        if player is None:
            return {"message": "Player not found"}, 404
        return format_player_response(player)

    def put(self, player_id):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        player = cur.fetchone()
        if player is None:
            return {"message": "Player not found"}, 404

        # Update only the attributes provided in the PUT request
        update_fields = {k: v for k, v in args.items() if v is not None}
        update_query = ", ".join([f"{field}=? " for field in update_fields.keys()])

        if update_query:
            query = f"UPDATE Players SET {update_query}WHERE PlayerID=?"
            db.execute(query, (*update_fields.values(), player_id))
            db.commit()
        emit('player_data_update', format_player_response(player_id), broadcast=True)
        return format_player_response(player_id)

    def delete(self, player_id):
        db = get_db()
        cur = db.execute("DELETE FROM Players WHERE PlayerID=?", (player_id,))
        db.commit()
        return {"message": "Player deleted successfully"}


class PlayerResource(Resource):
    def get(self):
        db = get_db()
        cur = db.execute("SELECT * FROM Players")
        all_players = cur.fetchall()
        result = [format_player_response(player) for player in all_players]
        return {"all_players": result}

    def post(self):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute(
            "INSERT INTO Players (PlayerID, Money, Debt, CareerID, ColorOfPiece, Avatar, University, Host, Homes, Languages, Stocks, Salary, Location, Path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                args["PlayerID"],
                args["Money"],
                args["Debt"],
                args["CareerID"],
                args["ColorOfPiece"],
                args["Avatar"],
                args["University"],
                args["Host"],
                args["Homes"],
                args["Languages"],
                args["Stocks"],
                args["Salary"],
                args["Location"],
                args["Path"],
            ),
        )
        db.commit()
        return "done"  # format_player_response(cur.lastrowid)

    def delete(self):
        db = get_db()
        cur = db.execute("DELETE FROM Players")
        db.commit()
        return {"message": "Players deleted successfully"}


class IncreaseSalaryResource(Resource):
    def put(self, player_id):
        parser = reqparse.RequestParser()
        parser.add_argument("increase_amount", type=float, required=True)
        args = parser.parse_args()

        db = get_db()
        cur = db.execute("SELECT Salary FROM Players WHERE PlayerID = ?", (player_id,))
        player = cur.fetchone()

        if player is None:
            return {"message": "Player not found"}, 404

        # Increase the salary by the specified amount
        new_salary = player[0] + args["increase_amount"]

        # Update the salary in the database
        db.execute(
            "UPDATE Players SET Salary=? WHERE PlayerID=?", (new_salary, player_id)
        )
        db.commit()

        # Retrieve the updated player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        updated_player = cur.fetchone()
        emit('player_data_update', format_player_response(player_id), broadcast=True)
        return format_player_response(updated_player)


class PaydayResource(Resource):
    @staticmethod
    def parse_boolean(value):
        if isinstance(value, bool):
            return value
        elif isinstance(value, str):
            if value.lower() == 'true':
                return True
            elif value.lower() == 'false':
                return False

        raise ValueError("Invalid boolean value for 'double_earning'")
    
    def put(self, player_id):
        parser = reqparse.RequestParser()
        parser.add_argument(
            "double_earning",
            type=self.parse_boolean,
            default=False
        )
        args = parser.parse_args()

        db = get_db()
        cur = db.execute(
            "SELECT Salary, Money FROM Players WHERE PlayerID = ?", (player_id,)
        )
        player = cur.fetchone()

        if player is None:
            return {"message": "Player not found"}, 404

        # Increase the salary by the specified amount
        increase_amount = 1
        if args["double_earning"] == True:
            increase_amount = 2
        new_salary = player[0] * increase_amount

        money = player[1] + new_salary
        # Update the salary in the database
        db.execute("UPDATE Players SET Money=? WHERE PlayerID=?", (money, player_id))
        db.commit()

        # Retrieve the updated player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        updated_player = cur.fetchone()
        emit('player_data_update', format_player_response(player_id), broadcast=True)
        return format_player_response(updated_player)


class LocationResource(Resource):
    def put(self, player_id):
        parser = reqparse.RequestParser()
        parser.add_argument("location", type=int, default=0)
        parser.add_argument("path", type=str, default="mainPath")
        args = parser.parse_args()

        db = get_db()
        cur = db.execute(
            "SELECT Location, Path FROM Players WHERE PlayerID = ?", (player_id,)
        )
        player = cur.fetchone()

        if player is None:
            return {"message": "Player not found"}, 404

        location = args["location"]
        path = args["path"]
        # Update the location in the database
        if location<0 or location >225:
            return {"message": "Location out of bounds"}, 400

        if path == "null":
            return {"message": "Path can't be none"}, 400 
        db.execute(
            "UPDATE Players SET Location=?, Path=? WHERE PlayerID=?",
            (location, path, player_id),
        )
        db.commit()

        # Retrieve the updated player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        updated_player = cur.fetchone()
        emit('player_data_update', format_player_response(player_id), broadcast=True)
        return format_player_response(updated_player)


class CareerResource(Resource):
    def put(self, player_id):
        parser = reqparse.RequestParser()
        parser.add_argument("career", type=str, required=True)
        args = parser.parse_args()

        db = get_db()
        cur = db.execute(
            "SELECT CareerID, Salary FROM Players WHERE PlayerID = ?", (player_id,)
        )
        player = cur.fetchone()

        if player is None:
            return {"message": "Player not found"}, 404

        # Check to see if requested career is taken. If not, update it so that it is now used
        car = db.execute(
            "SELECT Used, Salary FROM CareerCards WHERE CareerID = ?", (args["career"],)
        )
        career = car.fetchone()
        if career is None:
            return {"message": "Career not found"}, 404
        elif career[0]:
            return {"message": "Career is already taken"}, 405
        else:
            db.execute(
                "UPDATE CareerCards SET Used=1 WHERE CareerID=?", (args["career"],)
            )
        db.commit()

        # Set old career to not used
        db.execute("UPDATE CareerCards SET Used=0 WHERE CareerID=?", (player[0],))
        db.commit()

        # Update the salary and career for the player in the database
        db.execute(
            "UPDATE Players SET CareerID=?, Salary=? WHERE PlayerID=?",
            (
                args["career"],
                career[1],
                player_id,
            ),
        )
        db.commit()

        # Retrieve the updated player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        updated_player = cur.fetchone()
        emit('player_data_update', format_player_response(player_id), broadcast=True)
        return format_player_response(updated_player)


class AddCertReource(Resource):
    def put(self, player_id):
        parser = reqparse.RequestParser()
        parser.add_argument("cert", type=str)

        args = parser.parse_args()
        cert = args["cert"]
        db = get_db()

        # Retrieve player data
        cur = db.execute(
            "SELECT Languages, Salary FROM Players WHERE PlayerID = ?", (player_id,)
        )
        player = cur.fetchone()
        if player is None:
            return {"message": "Player not found"}, 404

        # Retrieve certification data
        cur = db.execute(
            "SELECT IsCert FROM Certifications WHERE CertID = ?", (cert,)
        )
        isCert= cur.fetchone()
        if isCert is None:
            return {"message": "Certification not found"}, 404

        # Check if the certification is already associated with the player
        certs = (player[0] or "").split(",")
        if cert not in certs:
            # Add language/certification to the player list
            certs.append(cert)
            updatedCerts = ",".join(certs)

            # Check if the certification exists in the database
            updatedSalary = float(player[1]) + 2000 if isCert[0] == 1 else player[1]

            # Update the certificates in the database
            db.execute(
                "UPDATE Players SET Languages=?, Salary=? WHERE PlayerID=?",
                (updatedCerts, updatedSalary, player_id),
            )
            db.commit()

            # Retrieve the updated player data
            cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
            updated_player = cur.fetchone()
            return format_player_response(updated_player)

        else:
            return {"message": "Certification already associated with the player"}, 400


class ChooseUniversity(Resource):
    def put(self, player_id):
        parser = reqparse.RequestParser()
        args = parser.parse_args()

        # Assuming get_db() returns the database connection
        db = get_db()

        # Fetch the player data from the database
        cur = db.execute(
            "SELECT Location, Path, Money, University FROM Players WHERE PlayerID = ?",
            (player_id,),
        )
        player_data = cur.fetchone()

        if player_data:
            # Convert the tuple to a dictionary for modification
            player_data_dict = {
                "Location": player_data[0],
                "Path": player_data[1],
                "Money": int(player_data[2]),  # Convert "Money" to an integer
                "University": player_data[3],
            }

            # Update player data for university choice
            player_data_dict["Location"] = 0
            player_data_dict["Path"] = "universityPath"
            player_data_dict["Money"] -= 100000

            # Update the database with the modified player data
            db.execute(
                "UPDATE Players SET University=?, Location=?, Path=?, Money=? WHERE PlayerID = ?",
                (
                    True,
                    player_data_dict["Location"],
                    player_data_dict["Path"],
                    player_data_dict["Money"],
                    player_id,  # Use player_id directly instead of args["PlayerID"]
                ),
            )

            db.commit()
            cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
            updated_player = cur.fetchone()
            emit('player_data_update', format_player_response(player_id), broadcast=True)
            return format_player_response(updated_player)
        else:
            return "Player not found.", 404


class PlayerHousesResource(Resource):
    def get(self, player_id):
        db = get_db()

        # Fetch the player's data
        cur_player = db.execute(
            "SELECT Homes FROM Players WHERE PlayerID = ?", (player_id,)
        )
        player_homes = cur_player.fetchone()

        if player_homes is None:
            return {"message": "Player not found"}, 404

        # Split the comma-separated list of house IDs
        house_ids = player_homes[0].split(",") if player_homes[0] else []

        # Fetch data for each house owned by the player
        houses_data = []
        for house_id in house_ids:
            cur_house = db.execute(
                "SELECT * FROM HouseCards WHERE HouseID = ?", (house_id,)
            )
            house_card = cur_house.fetchone()
            if house_card:
                houses_data.append(
                    {
                        "HouseID": house_card[0],
                        "Name": house_card[1],
                        "Cost": house_card[2],
                        "Image": house_card[3],
                        "Used": bool(house_card[4]),
                    }
                )

        return {"houses": houses_data}

class GetSkillPayments(Resource):
    def get(self, player_id):
        db = get_db()

        # Fetch the player's data
        cur_player = db.execute(
            "SELECT Languages, Money FROM Players WHERE PlayerID = ?", (player_id,)
        )
        player = cur_player.fetchone()
        if player is None:
            return {"message": "Player not found"}, 404

        # Split the comma-separated list of Cert IDs
        cert_ids = player[0].split(",") if player[0] else []
        money = player[1]
        
        #Calulate the total sum that the player should receive
        multiplier = len(cert_ids)
        payment = multiplier*5000
        newMoney = money + payment

        #Update the database with the new total money
        db.execute(
            "UPDATE Players SET Money=? WHERE PlayerID = ?",
            (
                newMoney,
                player_id,  
            ),
        )

        #Get the updated player information
        updated_player = db.execute(
            "SELECT * FROM Players WHERE PlayerID = ?", 
            (
                player_id,
            )
        )
        updated = updated_player.fetchone()
        if player is None:
            return {"message": "Player not found"}, 404

        return format_player_response(updated)


# Add the new resource to the API
api.add_resource(PlayerHousesResource, "/players/houses/<string:player_id>")


# Add the new resource to the API
api.add_resource(PaydayResource, "/players/payday/<string:player_id>")
api.add_resource(LocationResource, "/players/location/<string:player_id>")
api.add_resource(CareerResource, "/players/career/<string:player_id>")
api.add_resource(ChooseUniversity, "/players/university/<string:player_id>")
api.add_resource(GetSkillPayments, "/players/skill-payments/<string:player_id>")

api.add_resource(AddCertReource, "/players/add-certificate/<string:player_id>")

# Add the new resource to the API
api.add_resource(IncreaseSalaryResource, "/players/increase-salary/<string:player_id>")

api.add_resource(IndividualPlayerResource, "/players/<string:player_id>")
api.add_resource(PlayerResource, "/players")

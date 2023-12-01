from flask import Flask, request
from flask_restful import Api, Resource, reqparse
from database_init import *

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
    # Establish a connection to the database

    cursor = db.cursor()

    # Execute a query to fetch the career title based on the career ID
    cursor.execute("SELECT CertName FROM Certifications WHERE CertID = ?", (lang_id,))

    # Fetch the result
    result = cursor.fetchone()

    # Close the database connection

    # Return the career title if found, otherwise return None
    return result[0] if result else None

def format_player_response(player_data):
    career_id = player_data[3]
    career_title = get_career_title(career_id)

    # Convert house IDs to names
    house_ids = player_data[8].split(",") if player_data[8] else []
    house_names = [get_house_title(h_id) for h_id in house_ids]

    # Convert language IDs to names
    language_ids = player_data[9].split(",") if player_data[9] else []
    language_names = [get_language_title(lang_id) for lang_id in language_ids]

class BuyHouseResource(Resource):
    def put(self, player_id, house_id):
        db = get_db()

        # Retrieve player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        player = cur.fetchone()
        if player is None:
            return {"message": "Player not found"}, 404

        # Retrieve house data
        cur = db.execute("SELECT * FROM HouseCards WHERE HouseID = ?", (house_id,))
        house_card = cur.fetchone()
        if house_card is None:
            return {"message": "HouseCard not found"}, 404

        # Check if the player has enough money to buy the house
        house_cost = house_card[2]
        if player[1] < house_cost:
            return {"message": "Not enough money to buy the house"}, 400

        # Update player's money and mark the house as used
        new_money = player[1] - house_cost
        db.execute("UPDATE Players SET Money=? WHERE PlayerID=?", (new_money, player_id))

        db.execute("UPDATE HouseCards SET Used=1 WHERE HouseID=?", (house_id,))
        db.commit()

        # Append the house ID to the player's list of houses
        current_houses = player[8].split(",") if player[8] else []
        current_houses.append(house_id)
        updated_houses = ",".join(current_houses)
        db.execute("UPDATE Players SET Homes=? WHERE PlayerID=?", (updated_houses, player_id))
        db.commit()

        # Retrieve the updated player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        updated_player = cur.fetchone()

        return format_player_response(updated_player)



#parser = reqparse.RequestParser()

class SellHouseResource(Resource):
    

    def put(self, player_id, house_id):
        db = get_db()
        parser = reqparse.RequestParser()
        parser.add_argument('hasIncreased', type=bool, required=True, help='Boolean indicating whether to increase or decrease the price')
        # Retrieve player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        player = cur.fetchone()
        if player is None:
            return {"message": "Player not found"}, 404

        # Retrieve house data
        cur = db.execute("SELECT * FROM HouseCards WHERE HouseID = ?", (house_id,))
        house_card = cur.fetchone()
        if house_card is None:
            return {"message": "HouseCard not found"}, 404

        # Check if the player owns the house
        player_houses = player[8].split(",") if player[8] else []
        if house_id not in player_houses:
            return {"message": "Player does not own this house"}, 400

        # Parse the request arguments using reqparse
        args = parser.parse_args()
        has_increased = args['hasIncreased']

        # Determine whether to multiply or divide by the increase factor
        increase_factor = 1.5 if has_increased else 1 / 1.5

        # Calculate the selling price based on the increase factor
        selling_price = house_card[2] * increase_factor

        # Update player's money, mark the house as unused, and remove the house from the player's list
        new_money = player[1] + selling_price
        player_houses.remove(house_id)
        updated_houses = ",".join(player_houses)
        
        db.execute("UPDATE Players SET Money=?, Homes=? WHERE PlayerID=?", (new_money, updated_houses, player_id))
        db.execute("UPDATE HouseCards SET Used=0 WHERE HouseID=?", (house_id,))
        db.commit()

        # Retrieve the updated player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        updated_player = cur.fetchone()

        return format_player_response(updated_player)


# Add the new resource to the API
api.add_resource(SellHouseResource, "/players/sell-house/<string:player_id>/<string:house_id>")

# Add the new resource to the API
api.add_resource(BuyHouseResource, "/players/buy-house/<string:player_id>/<string:house_id>")


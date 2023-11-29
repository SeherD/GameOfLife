from flask import Flask, request
from flask_restful import Api, Resource, reqparse
from database_init import *

def format_player_response(player_data):
    return {
        "PlayerID": player_data[0],
        "Money": player_data[1],
        "Debt": player_data[2],
        "CareerID": player_data[3],
        "ColorOfPiece": player_data[4],
        "Avatar": player_data[5],
        "University": player_data[6],
        "Host": player_data[7],
        "Homes": player_data[8].split(",") if player_data[8] else [],
        "Languages": player_data[9].split(",") if player_data[9] else [],
        "Stocks": player_data[10].split(",") if player_data[10] else [],
        "Salary": player_data[11],
    }

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



class SellHouseResource(Resource):
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

        # Check if the player owns the house
        player_houses = player[8].split(",") if player[8] else []
        if house_id not in player_houses:
            return {"message": "Player does not own this house"}, 400

        # Calculate the selling price based on an increase factor
        increase_factor = 1.5  # You can adjust this factor as needed
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

if __name__ == "__main__":
    app.run(debug=True)
# Add the new resource to the API
api.add_resource(BuyHouseResource, "/players/buy-house/<string:player_id>/<string:house_id>")

if __name__ == "__main__":
    app.run(debug=True)

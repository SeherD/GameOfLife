from flask import Flask, request
from flask_restful import Api, Resource, reqparse
from database_init import *

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
        "Location": player_data[12],
        "Path": player_data[13],
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

        return format_player_response(updated_player)


class PaydayResource(Resource):
    def put(self, player_id):
        parser = reqparse.RequestParser()
        parser.add_argument("double_earning", type=bool, default=False)
        args = parser.parse_args()

        db = get_db()
        cur = db.execute("SELECT Salary, Money FROM Players WHERE PlayerID = ?", (player_id,))
        player = cur.fetchone()

        if player is None:
            return {"message": "Player not found"}, 404

        # Increase the salary by the specified amount
        increase_amount = 1
        if args["double_earning"]:
                increase_amount = 2
        new_salary = player[0] * increase_amount
        
        money = player[1] + new_salary
        # Update the salary in the database
        db.execute(
            "UPDATE Players SET Money=? WHERE PlayerID=?", (money, player_id)
        )
        db.commit()

        # Retrieve the updated player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        updated_player = cur.fetchone()

        return format_player_response(updated_player)

class LocationResource(Resource):
    def put(self, player_id):
        parser = reqparse.RequestParser()
        parser.add_argument("location", type=int, default=0)
        parser.add_argument("path", type=str, default="mainPath")
        args = parser.parse_args()

        db = get_db()
        cur = db.execute("SELECT Location, Path FROM Players WHERE PlayerID = ?", (player_id,))
        player = cur.fetchone()

        if player is None:
            return {"message": "Player not found"}, 404
        
        location = args["location"]
        path = args["path"]
        # Update the location in the database
        db.execute(
            "UPDATE Players SET Location=?, Path=? WHERE PlayerID=?", (location, path, player_id)
        )
        db.commit()

        # Retrieve the updated player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        updated_player = cur.fetchone()

        return format_player_response(updated_player)        

class AddCertReource(Resource):
    def put(self, player_id):    
        parser = reqparse.RequestParser()
        parser.add_argument("cert", type=str)
        args = parser.parse_args()

        db = get_db()
        cur = db.execute("SELECT Languages FROM Players WHERE PlayerID = ?", (player_id,))
        player = cur.fetchone()

        if player is None:
            return {"message": "Player not found"}, 404
        
        #Add language/certification to the player list
        updatedCerts = player[0] + "," + args["cert"]

        #Update the certificates in the database
        db.execute(
            "UPDATE Players SET Languages=? WHERE PlayerID=?", (updatedCerts, player_id)
        )
        db.commit()

        # Retrieve the updated player data
        cur = db.execute("SELECT * FROM Players WHERE PlayerID = ?", (player_id,))
        updated_player = cur.fetchone()

        return format_player_response(updated_player)            


# Add the new resource to the API
api.add_resource(PaydayResource, "/players/payday/<string:player_id>")
api.add_resource(LocationResource, "/players/location/<string:player_id>")
api.add_resource(AddCertReource, "/players/AddCertificate/<string:player_id>")


# Add the new resource to the API
api.add_resource(IncreaseSalaryResource, "/players/increase-salary/<string:player_id>")

api.add_resource(IndividualPlayerResource, "/players/<string:player_id>")
api.add_resource(PlayerResource, "/players")

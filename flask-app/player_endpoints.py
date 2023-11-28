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


# TODO:
# languages/certs,
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
            "INSERT INTO Players (PlayerID, Money, Debt, CareerID, ColorOfPiece, Avatar, University, Host, Homes, Languages, Stocks, Salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument("double_earning", type=bool, default=False)
        args = parser.parse_args()

        db = get_db()
        cur = db.execute("SELECT PlayerID, Salary FROM Players")
        all_players = cur.fetchall()

        for player in all_players:
            player_id, salary = player
            increase_amount = salary

            if args["double_earning"]:
                increase_amount *= 2

            # Increase the money for each player
            db.execute(
                "UPDATE Players SET Money=Money+? WHERE PlayerID=?",
                (increase_amount, player_id),
            )

        db.commit()

        # Retrieve the updated player data after the payday
        cur = db.execute("SELECT * FROM Players")
        updated_players = cur.fetchall()

        result = [format_player_response(player) for player in updated_players]
        return {"updated_players": result}


# Add the new resource to the API
api.add_resource(PaydayResource, "/players/payday")


# Add the new resource to the API
api.add_resource(IncreaseSalaryResource, "/players/increase-salary/<string:player_id>")

api.add_resource(IndividualPlayerResource, "/players/<string:player_id>")
api.add_resource(PlayerResource, "/players")

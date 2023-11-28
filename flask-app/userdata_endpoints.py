from flask_restful import reqparse
from flask import Flask, g, request
from flask_restful import Resource, Api
import sqlite3
from database_init import *

parser = reqparse.RequestParser()
parser.add_argument('UserID', type=str)
parser.add_argument('PlayerName', type=str)
parser.add_argument('HighestScore', type=float)
parser.add_argument('AccountID', type=str)

def format_userdata_response(user_data):
    return {
        "UserID": user_data[0],
        "PlayerName": user_data[1],
        "HighestScore": user_data[2],
        "AccountID": user_data[3],        
    }

class UserDataResource(Resource):
    def get(self, user_id):
        db = get_db()
        cur = db.execute('SELECT * FROM UserData WHERE UserID = ?', (user_id,))
        userdata = cur.fetchone()
        if userdata is None:
            return {'message': 'User data not found'}, 404
        return self.format_userdata_response(userdata)

    
    def put(self, user_id):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute('SELECT * FROM UserData WHERE UserID = ?', (user_id,))
        userdata = cur.fetchone()
        if userdata is None:
            return {'message': 'User data not found'}, 404

        # Update only the attributes provided in the PUT request
        update_fields = {k: v for k, v in args.items() if v is not None}
        update_query = ', '.join([f"{field}=? " for field in update_fields.keys()])

        if update_query:
            query = f'UPDATE UserData SET {update_query} WHERE UserID=?'
            db.execute(query, (*update_fields.values(), user_id))
            db.commit()

        return self.format_account_response(user_id)

    def delete(self, user_id):
        db = get_db()
        cur = db.execute('DELETE FROM UserData WHERE UserID=?', (user_id,))
        db.commit()
        return {'message': 'User data deleted successfully'}
    
class UserDataResources(Resource):
    def post(self):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute(
            "INSERT INTO UserData (UserID, PlayerName, HighestScore, AccountID) VALUES (?, ?, ?, ?)",
            (
                args["UserID"],
                args["PlayerName"],
                args["HighestScore"],
                args["AccountID"],
            ),
        )
        db.commit()
        return "done" #format_account_response(cur.lastrowid)

api.add_resource(UserDataResource, "/userdata/<string:user_id>")
api.add_resource(UserDataResources, "/userdata")
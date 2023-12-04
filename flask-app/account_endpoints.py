from flask_restful import reqparse
from flask import Flask, g, request
from flask_restful import Resource, Api
import sqlite3
from database_init import *

parser = reqparse.RequestParser()
parser.add_argument('AccountID', type=str)
parser.add_argument('Username', type=str)
parser.add_argument('Password', type=str)
parser.add_argument('FirstName', type=str)
parser.add_argument('LastName', type=str)

def format_account_response(account_data):
    return {
        "AccountID": account_data[0],
        "Username": account_data[1],
        "Password": account_data[2],
        "FirstName": account_data[3],
        "LastName": account_data[4],
    }

class AccountResource(Resource):
    def get(self, account_id):
        db = get_db()
        cur = db.execute('SELECT * FROM Accounts WHERE AccountID = ?', (account_id,))
        account = cur.fetchone()
        if account is None:
            return {'message': 'Account not found'}, 404
        return self.format_account_response(account)

    
    def put(self, account_id):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute('SELECT * FROM Accounts WHERE AccountID = ?', (account_id,))
        account = cur.fetchone()
        if account is None:
            return {'message': 'Account not found'}, 404

        # Update only the attributes provided in the PUT request
        update_fields = {k: v for k, v in args.items() if v is not None}
        update_query = ', '.join([f"{field}=? " for field in update_fields.keys()])

        if update_query:
            query = f'UPDATE Accounts SET {update_query} WHERE AccountID=?'
            db.execute(query, (*update_fields.values(), account_id))
            db.commit()

        return self.format_account_response(account_id)

    def delete(self, account_id):
        db = get_db()
        cur = db.execute('DELETE FROM Accounts WHERE AccountID=?', (account_id,))
        db.commit()
        return {'message': 'Account deleted successfully'}
    
class AccountsResource(Resource):
    def post(self):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute(
            "INSERT INTO Accounts (AccountID, Username, Password, FirstName, LastName) VALUES (?, ?, ?, ?, ?)",
            (
                args["AccountID"],
                args["Username"],
                args["Password"],
                args["FirstName"],
                args["LastName"],
            ),
        )
        db.commit()
        return "done" #format_account_response(cur.lastrowid)
    
class AuthenticateResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("clientUsername", type=str, required=True)
        parser.add_argument("clientPassword", type=str, required=True)
        args = parser.parse_args()

        uName = args["clientUsername"]
        passWord = args["clientPassword"]

        db = get_db()
        cur = db.execute("SELECT Username, Password FROM Accounts WHERE Username = ?", (uName,))
        account = cur.fetchone()
        accID = account[0]

        if account is None:
            return {"message": "Account not found"}, 404
        elif account.length >= 2:
            return {"message": "Error: multiple accounts found"}, 502
        
        if passWord != account[2]:
            return {"message": "Authentication failed"}, 401
        elif passWord == account[2]:
            account = db.execute("SELECT * FROM Accounts WHERE Username = ?", (accID,))
            return format_account_response(account)
        else:
            return {"message": "I'm a teapot"}, 418
        

        

api.add_resource(AccountResource, "/accounts/<string:account_id>")
api.add_resource(AccountsResource, "/accounts")
api.add_resource(AuthenticateResource, "/accounts/authenticate")

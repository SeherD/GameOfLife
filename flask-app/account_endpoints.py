from flask_restful import reqparse
from flask import Flask, g, request
from flask_restful import Resource, Api
import sqlite3
from database_init import *

parser = reqparse.RequestParser()
parser.add_argument('Username', type=str)
parser.add_argument('Password', type=str)

def format_account_response(account_data):
    return {
        "Username": account_data[0],
        "Password": account_data[1],
    }

class AccountResource(Resource):
    def get(self, username):
        db = get_db()
        cur = db.execute('SELECT * FROM Accounts WHERE Username = ?', (username,))
        account = cur.fetchone()
        if account is None:
            return {'message': 'Account not found'}, 404
        return self.format_account_response(account)

    
    def put(self, username):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute('SELECT * FROM Accounts WHERE Username = ?', (username,))
        account = cur.fetchone()
        if account is None:
            return {'message': 'Account not found'}, 404

        # Update only the attributes provided in the PUT request
        update_fields = {k: v for k, v in args.items() if v is not None}
        update_query = ', '.join([f"{field}=? " for field in update_fields.keys()])

        if update_query:
            query = f'UPDATE Accounts SET {update_query} WHERE AccountID=?'
            db.execute(query, (*update_fields.values(), username))
            db.commit()

        return self.format_account_response(username)

    def delete(self, username):
        db = get_db()
        cur = db.execute('DELETE FROM Accounts WHERE Username=?', (username,))
        db.commit()
        return {'message': 'Account deleted successfully'}
    
from flask_restful import Resource, reqparse

class CreateAccountResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("Username", required=True, help="Username is required")
        parser.add_argument("Password", required=True, help="Password is required")
        args = parser.parse_args()

        db = get_db()

        # Prevent nasty shenanigans from illegal database accesses in the login page
        bad_characters = [";", "*", "--", "?", '"', "'", " ", "\\"]
        if args["Username"].lower() == "null" or args["Password"].lower() == "null":
            return {"message": "You cannot use 'null' as a username or password"}
        elif any(x in args["Username"] for x in bad_characters):
            return {"message": "Invalid characters in the username"}
        elif any(x in args["Password"] for x in bad_characters):
            return {"message": "Invalid characters in the password"}

        # Check to make sure there is no existing account with that username in the database
        check_account = db.execute("SELECT * FROM Accounts WHERE Username = ?", (args["Username"],))
        existing_account = check_account.fetchone()
        if existing_account:
            return {"message": "Account username is already taken"}

        db.execute(
            "INSERT INTO Accounts (Username, Password) VALUES (?, ?)",
            (
                args["Username"],
                args["Password"],
            )
        )
        db.commit()

        # Get and return the new account
        cur = db.execute("SELECT Username FROM Accounts WHERE Username = ?", (args["Username"],))
        new_account = cur.fetchone()
        return {"username": new_account[0]}

    


class AuthenticateResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("Username", type=str, required=True)
        parser.add_argument("Password", type=str, required=True)
        args = parser.parse_args()

        uName = args["Username"]
        passWord = args["Password"]
        badCharacters = [";", "*", "--", "?", '"', "'", " ", "\\"]

        if uName.lower() == "null" or passWord.lower() == "null":
            return {"message": "Invalid username or password"}
        elif any(x in args["Username"] for x in badCharacters):
            return {"message": "Invalid characters in the username"}
        elif any(x in args["Password"] for x in badCharacters):
            return {"message": "Invalid characters in the password"}

        db = get_db()
        cur = db.execute("SELECT * FROM Accounts WHERE Username = ?", (uName,))
        account = cur.fetchone()

        if account is None:
            return {"message": "Account not found"}
        elif cur.rowcount > 1:
            return {"message": "Error: multiple accounts found"}, 502

        # Assuming the password is stored in the second column
        if passWord != account[1]:
            return {"message": "Authentication failed"}, 401

        # Return the username only
        return {"username": account[0]}


api.add_resource(AccountResource, "/accounts/<string:account_id>")
api.add_resource(CreateAccountResource, "/accounts/create-account")
api.add_resource(AuthenticateResource, "/accounts/authenticate")

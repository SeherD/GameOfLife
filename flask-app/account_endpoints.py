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
    
class CreateAccountResource(Resource):
    def post(self):
        args = parser.parse_args()
        db = get_db()

        badCharacters = [";", "*", "--", "?", '"', "'", " ", "\\"]

        #Prevent nasty shenanigans from illegal database accesses in the login page
        if args["Username"] == "null" or args["Password"] == "null":
            return {"message": "You cannot use this as a username"}, 422
        elif any(x in args["Username"] for x in badCharacters):
            return {"message": "You cannot use these characters in a username : ';'  '*'  '--' '?', '"}, 422
        elif any(x in args["Password"] for x in badCharacters):
            return {"message": "You cannot use these characters in a password : ';'  '*'  '--' '?', ' "}, 422

        #Check to make sure there is no existing account with that username in the database
        checkAccounts = db.execute("SELECT * FROM Accounts WHERE Username = ?", (args["Username"],))
        check = checkAccounts.fetchone()
        if check is not None:
            return {"message": "Account username is already taken"}, 422       

        db.execute(
            "INSERT INTO Accounts (Username, Password) VALUES (?, ?)",
            (
                args["Username"],
                args["Password"],
            ),
        )
        db.commit()

        #Get and return new account
        cur = db.execute("SELECT * FROM Accounts WHERE Username = ?", (args["Username"],))
        return format_account_response(cur)
    
class AuthenticateResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("clientUsername", type=str, required=True)
        parser.add_argument("clientPassword", type=str, required=True)
        args = parser.parse_args()

        uName = args["clientUsername"]
        passWord = args["clientPassword"]
        badCharacters = [";", "*", "--", "?", '"', "'", " ", "\\"]

        if uName == "null" or passWord == "null":
            return {"message": "Invalid username or password"}, 422
        elif any(x in args["Username"] for x in badCharacters):
            return {"message": "Invalid username"}, 422
        elif any(x in args["Password"] for x in badCharacters):
            return {"message": "Invalid password"}, 422

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
api.add_resource(CreateAccountResource, "/accounts/create-account")
api.add_resource(AuthenticateResource, "/accounts/authenticate")

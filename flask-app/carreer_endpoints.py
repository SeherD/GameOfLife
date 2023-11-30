from flask_restful import reqparse
from flask import Flask, g
from flask_restful import Resource, Api
import sqlite3
from database_init import *

parser = reqparse.RequestParser()
parser.add_argument('Name', type=str)
parser.add_argument('Salary', type=float)
parser.add_argument('University_Required', type=bool)
parser.add_argument('Image', type=str)
parser.add_argument('Used', type=bool)

class CareerCardResource(Resource):
    def get(self, career_id):
        db = get_db()
        cur = db.execute('SELECT * FROM CareerCards WHERE CareerID = ?', (career_id,))
        career_card = cur.fetchone()
        if career_card is None:
            return {'message': 'CareerCard not found'}, 404
        return {'CareerID': career_card[0], 'Name': career_card[1], 'Salary': career_card[2],
                'University_Required': bool(career_card[3]), 'Image': career_card[4], 'Used': bool(career_card[5])}

    def put(self, career_id):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute('SELECT * FROM CareerCards WHERE CareerID = ?', (career_id,))
        career_card = cur.fetchone()
        if career_card is None:
            return {'message': 'CareerCard not found'}, 404

        db.execute('UPDATE CareerCards SET Used=? WHERE CareerID=?',
                   (args['Used'], career_id))
        db.commit()
        return {'CareerID': career_id, 'Name': args['Name'], 'Salary': args['Salary'],
                'University_Required': args['University_Required'], 'Image': args['Image'], 'Used': args['Used']}


class CareerCardListResource(Resource):
    def get(self):
        db = get_db()
        cur = db.execute('SELECT * FROM CareerCards')
        career_cards = cur.fetchall()
        result = [{'CareerID': card[0], 'Name': card[1], 'Salary': card[2],
                   'University_Required': bool(card[3]), 'Image': card[4], 'Used': bool(card[5])} for card in career_cards]
        return {'career_cards': result}

    

class UnusedCareerCardListResource(Resource):
    def get(self):
        db = get_db()
        cur = db.execute('SELECT * FROM CareerCards WHERE Used = 0')
        unused_career_cards = cur.fetchall()
        result = [{'CareerID': card[0], 'Name': card[1], 'Salary': card[2],
                   'University_Required': bool(card[3]), 'Image': card[4], 'Used': bool(card[5])} for card in unused_career_cards]
        return {'unused_career_cards': result}
    
class PlayerAllowedCareerResource(Resource):
    def get(self, player_id):
        db = get_db()
        cur = db.execute("SELECT University FROM Players WHERE PlayerID = ?", (player_id,))
        player = cur.fetchone()
        if player is None:
            return {"message": "Player not found"}, 404
        
        #Determine whether the player can choose careers available to those who went to university
        if player[0]:
            #Code to select any unused career from the list
            cur = db.execute('SELECT * FROM CareerCards WHERE Used = 0')
            available_career_cards = cur.fetchall()
            result = [{'CareerID': card[0], 'Name': card[1], 'Salary': card[2],
                   'University_Required': bool(card[3]), 'Image': card[4], 'Used': bool(card[5])} for card in available_career_cards]
            return {'available_career_cards': result}
        else:
            #Code to select non-uni, unused careers only
            cur = db.execute('SELECT * FROM CareerCards WHERE Used = 0 AND University_Required = 0')
            available_career_cards = cur.fetchall()
            result = [{'CareerID': card[0], 'Name': card[1], 'Salary': card[2],
                   'University_Required': bool(card[3]), 'Image': card[4], 'Used': bool(card[5])} for card in available_career_cards]
            return {'available_career_cards': result}
        

        

api.add_resource(CareerCardResource, '/career/<string:career_id>')
api.add_resource(CareerCardListResource, '/career')
api.add_resource(UnusedCareerCardListResource, '/career/unused')
api.add_resource(PlayerAllowedCareerResource, '/career/filterByUniversity/<string:player_id>')



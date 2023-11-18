from flask_restful import reqparse
from flask import Flask, g
from flask_restful import Resource, Api
import sqlite3
from database_init import *


parser = reqparse.RequestParser()
parser.add_argument('Used', type=bool)

class HouseCardResource(Resource):
    def get(self, house_id):
        db = get_db()
        cur = db.execute('SELECT * FROM HouseCards WHERE HouseID = ?', (house_id,))
        house_card = cur.fetchone()
        if house_card is None:
            return {'message': 'HouseCard not found'}, 404
        return {'HouseID': house_card[0], 'Name': house_card[1], 'Cost': house_card[2],
                'Image': house_card[3], 'Used': bool(house_card[4])}

    def put(self, house_id):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute('SELECT * FROM HouseCards WHERE HouseID = ?', (house_id,))
        house_card = cur.fetchone()
        if house_card is None:
            return {'message': 'HouseCard not found'}, 404

        db.execute('UPDATE HouseCards SET Used=? WHERE HouseID=?',
                   (args['Used'], house_id))
        db.commit()
        return {'HouseID': house_id, 'Used': args['Used']}

class HouseCardListResource(Resource):
    def get(self):
        db = get_db()
        cur = db.execute('SELECT * FROM HouseCards')
        house_cards = cur.fetchall()
        result = [{'HouseID': card[0], 'Name': card[1], 'Cost': card[2],
                   'Image': card[3], 'Used': bool(card[4])} for card in house_cards]
        return {'house_cards': result}

class UnusedHouseCardListResource(Resource):
    def get(self):
        db = get_db()
        cur = db.execute('SELECT * FROM HouseCards WHERE Used = 0')
        unused_house_cards = cur.fetchall()
        result = [{'HouseID': card[0], 'Name': card[1], 'Cost': card[2],
                   'Image': card[3], 'Used': bool(card[4])} for card in unused_house_cards]
        return {'unused_house_cards': result}

api.add_resource(HouseCardResource, '/house/<string:house_id>')
api.add_resource(HouseCardListResource, '/house')
api.add_resource(UnusedHouseCardListResource, '/house/unused')



from flask import Flask, request
from flask_restful import Api, Resource, reqparse

from database_init import *
parser = reqparse.RequestParser()
parser.add_argument('GameID', type=str)
parser.add_argument('BoardState', type=str)
parser.add_argument('HostID', type=str)
parser.add_argument('Players', type=list)
parser.add_argument('Finished', type=bool)

class GameResource(Resource):
    def get(self, game_id):
        db = get_db()
        cur = db.execute('SELECT * FROM Games WHERE GameID = ?', (game_id,))
        game = cur.fetchone()
        if game is None:
            return {'message': 'Game not found'}, 404
        return self.format_game_response(game)

    
    def put(self, game_id):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute('SELECT * FROM Games WHERE GameID = ?', (game_id,))
        game = cur.fetchone()
        if game is None:
            return {'message': 'Game not found'}, 404

        # Update only the attributes provided in the PUT request
        update_fields = {k: v for k, v in args.items() if v is not None}
        update_query = ', '.join([f"{field}=? " for field in update_fields.keys()])

        if update_query:
            query = f'UPDATE Games SET {update_query}WHERE GameID=?'
            db.execute(query, (*update_fields.values(), game_id))
            db.commit()

        return self.format_game_response(game_id)

    def delete(self, game_id):
        db = get_db()
        cur = db.execute('DELETE FROM Games WHERE GameID=?', (game_id,))
        db.commit()
        return {'message': 'Game deleted successfully'}

    def format_game_response(self, game_data):
        return {
            'GameID': game_data[0],
            'BoardState': game_data[1],
            'HostID': game_data[2],
            'Players': game_data[3].split(',') if game_data[3] else [],
            'Finished': bool(game_data[4])
        }


class GamesResource(Resource):
    def post(self):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute(
            'INSERT INTO Games (GameID, BoardState, HostID, Players, Finished) VALUES (?, ?, ?, ?, ?)',
            (args['GameID'], args['BoardState'], args['HostID'], args['Players'], args['Finished']))
        db.commit()
        return self.format_game_response(cur.lastrowid)


api.add_resource(GameResource, '/games/<string:game_id>')
api.add_resource(GamesResource, '/games/')

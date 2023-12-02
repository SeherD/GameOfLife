from flask import Flask, g
from flask_restful import Resource, Api
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS
from database_init import *
from house_endpoints import *
from carreer_endpoints import *
from player_endpoints import *
from game_endpoints import *
from sale_house_endpoints import *

app = Flask(__name__)
CORS(app)
api = Api(app)
socketio = SocketIO(app, cors_allowed_origins="*")  # Adjust the origins as needed

# Your existing endpoint registrations go here (e.g., api.add_resource(SomeResource, '/some_endpoint'))

connected_players = set()

@socketio.on('connect')
def handle_connect():
    if len(connected_players) < 5:
        # Allow connection
        connected_players.add(request.sid)
        join_room(request.sid)
        print(f"Player {request.sid} connected. Total connected players: {len(connected_players)}")
    else:
        print("Room full")

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
    # Handle any disconnection logic here

@socketio.on('update_gameboard')
def handle_update_gameboard(data):
    # Handle gameboard updates and broadcast to all clients
    emit('update_gameboard', data, broadcast=True)

@socketio.on('update_player_data')
def handle_update_player_data(data):
    # Handle player-specific data updates and broadcast to all clients
    emit('update_player_data', data, broadcast=True)

if __name__ == '__main__':
    # init_db()  # Initialize your database if needed
    socketio.run(app, port=5000)

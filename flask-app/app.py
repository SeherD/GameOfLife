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


def load_all_player_data():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Players")
    all_player_data = cursor.fetchall()
    return all_player_data

connected_players = set()

@socketio.on('connect')
def handle_connect():
    if len(connected_players) < 5:
        # Allow connection
        connected_players.add(request.sid)
        join_room(request.sid)
        print(f"Player {request.sid} connected. Total connected players: {len(connected_players)}")

        # Load all player data from the database
        all_player_data = load_all_player_data()

        # Send all player data to the new player
        emit('all_player_data', all_player_data, room=request.sid)

        # Broadcast to all clients about the new player
        emit('new_player_connected', {'player_id': request.sid}, broadcast=True)

    else:
        print("Room full")

def load_player_data(player_id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM Players WHERE PlayerID=?", (player_id,))
    player_data = cursor.fetchone()

    return player_data   
  
@socketio.on('reconnect')
def handle_reconnect():
    # Get the player ID from the request
    player_id = request.sid

    # Load the player data from the database
    player_data = load_player_data(player_id)

    if player_data:
        # Send the player data to the reconnected player
        emit('load_player_data', player_data, room=request.sid)
        print(f"Player {player_id} reconnected.")

    
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

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
from certification_endpoints import *
from account_endpoints import *

CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")  # Adjust the origins as needed


def load_all_player_data():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Players")
    all_player_data = cursor.fetchall()
    return all_player_data

connected_players = set()


from enum import Enum



PlayerColor = ["Red","Blue", "Green", "Yellow", "Pink"]
# Rest of your code...

@socketio.on('connect')
def handle_connect(auth):
    print(auth)
    if len(connected_players) < 5:
        # Allow connection
        player_id = request.sid
        connected_players.add(player_id)
        join_room(player_id)
        print(f"Player {player_id} connected. Total connected players: {len(connected_players)}")

        # Load all player data from the database
        all_player_data = load_all_player_data()

        if len(connected_players) == 1:
             # First player
            id = "P1"
            avatar_number = 1
            host_value = 1
            color = PlayerColor[avatar_number-1]
        else:
            # Subsequent players
            id = f"P{len(connected_players)}"
            avatar_number = len(connected_players)
            host_value = 0
            color = PlayerColor[avatar_number-1]

        # Insert new player into the database
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO Players 
            (PlayerID, Money, Debt, CareerID, ColorOfPiece, Avatar, University, Host, Homes, Languages, Stocks, Salary, Location, Path)
            VALUES (?, 200000, 0, '', ?, 'Avatar{}.png', 0, ?, '', '', '', 0, 0, 'mainPath')
        """.format(avatar_number), (id, color, host_value))

        # Commit the changes
        db.commit()

        # Send all player data to the new player
        emit('all_player_data', all_player_data, room=player_id)

        # Broadcast to all clients about the new player
        emit('new_player_connected', {'player_id': player_id}, broadcast=True)

    else:
        print("Room full")

# Rest of the code remains unchanged


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
    player_num=connected_players.index(player_id)+1

    # Load the player data from the database
    player_data = load_player_data(f"P{player_num}")

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
    #init_db()  # Initialize your database if needed
    socketio.run(app, port=5000)

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

@socketio.on('hostInLobby')
def handle_host_in_lobby():
    # Emit the number of connected players to the host
    socketio.emit('updatePlayers', len(connected_players))

def load_all_player_data():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Players")
    all_player_data = cursor.fetchall()
    return all_player_data

connected_players = []
disconnected_players = []

connection_tuples=[]

@socketio.on('startGame')
def start_game():
    print("Switch")
    socketio.emit('switch_game', {})



PlayerColor = ["#FF9800","#03A9F4", "#9C27B0", "#E91E63", "#4169E1"]
# Rest of your code...

def is_player_disconnected(username):
    return username.strip().lower() in disconnected_players

@socketio.on('connect_with_username')
def handle_connect_with_username(auth):
    username = auth.get('username')
    player_id = request.sid
    connection_tuples.append((player_id, username))

    if is_player_disconnected(username):
        # Player is reconnecting
        print(f"Player {username} is reconnecting.")
        connected_players.append(username)
        # Load player data for the reconnecting player
        player_data = load_player_data_by_username(username)

        if player_data:
            print(player_data)
            # Send the player data to the reconnecting player
            print(player_id)
            socketio.emit('update_player_data', format_player_response(player_data), room=player_id)
            print(f"Player {username} data sent to the reconnected player.")
            socketio.emit('reconnect',{'modalClose': "true"}, room=player_id)
            # Broadcast to all clients about the player reconnection
            socketio.emit('player_reconnected', {'player_id': f"P{len(connected_players)}", 'username': username})
        else:
            print(f"Player {username} data not found for reconnection.")
    elif username not in connected_players:
        # New player connection
        if len(connected_players) < 5:
            # Allow connection
            connected_players.append(username)
            join_room(player_id)
            print(f"Player {username} connected. Total connected players: {len(connected_players)}")
            socketio.emit('updatePlayers', len(connected_players))
            # Load all player data from the database
            all_player_data = load_all_player_data()

            if len(connected_players) == 1:
                # First player
                id = f"P{len(connected_players)}"
                avatar_number = len(connected_players)
                host_value = 1
                color = PlayerColor[avatar_number-1]
            else:
                # Subsequent players
                id = f"P{len(connected_players)}"
                avatar_number = len(connected_players)
                host_value = 0
                color = PlayerColor[avatar_number-1]

            socketio.emit('player_id', {'player_id': id, 'username': username}, room=player_id)

            # Insert new player into the database if not previously disconnected
            if not is_player_disconnected(username):
                db = get_db()
                cursor = db.cursor()
                cursor.execute("""
                    INSERT INTO Players 
                    (PlayerID, Money, Debt, CareerID, ColorOfPiece, Avatar, University, Host, Homes, Languages, Stocks, Salary, Location, Path)
                    VALUES (?, 200000, 0, '', ?, 'Avatar{}.png', 0, ?, '', '', '', 0, 0, 'mainPath')
                """.format(avatar_number), (id, color, host_value))

                # Commit the changes
                db.commit()
                cursor.execute("""
                    INSERT INTO UserPlayer (PlayerID, Username)
                    VALUES (?, ?)
                """, (id, username))
                db.commit()

            # Send all player data to the new player
            socketio.emit('all_player_data', all_player_data, room=player_id)

            # Broadcast to all clients about the new player
            socketio.emit('new_player_connected', {'username': username})

        else:
            print("Room full")
    else:
        print(f"Player {username} already connected.")


# Rest of the code remains unchanged


def load_player_data_by_username(username):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM UserPlayer WHERE Username=?", (username,))
    user_player_data = cursor.fetchone()

    if user_player_data:
        player_id = user_player_data[0]
        cursor.execute("SELECT * FROM Players WHERE PlayerID=?", (player_id,))
        player_data = cursor.fetchone()
        return player_data
    else:
        return None

@socketio.on('update_turn_number')
def update_turn_number(data):
    turn_number = data.get('turnNumber')
    if (turn_number == len(connected_players) - 1):
        new_turn_number = 0
    else:
        new_turn_number = turn_number + 1
    socketio.emit('update_turn_number', {'turnNumber': new_turn_number})
@socketio.on('game_over')
def handle_endgame():
    socketio.emit('game_over')
    
@socketio.on('disconnect')
def handle_disconnect():
    player_id = request.sid
    match = next((tup for tup in connection_tuples if tup[0] == player_id), None)
   
    print(connection_tuples)
    print(connected_players)
    print(match)

    if match is not None:
        print(f'Player {match[1]} disconnected.')
        normalized_username = match[1].strip().lower()

        # Remove the disconnected player from the set
        normalized_players = list(map(str.lower, connected_players))
        if normalized_username in normalized_players:
            index = normalized_players.index(normalized_username)
            connected_players.pop(index)
            disconnected_players.append(normalized_username)

        
        

    else:
        print(f'Player not found or already removed.')



if __name__ == '__main__':
    init_db()
    initialize_game_data()
    socketio.run(app, host='0.0.0.0', port=5000, use_reloader=True, allow_unsafe_werkzeug=True)

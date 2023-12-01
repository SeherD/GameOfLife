from flask_restful import reqparse
from flask import Flask, g
from flask_restful import Resource, Api
import sqlite3
from database_init import *
from house_endpoints import *
from carreer_endpoints import *
from player_endpoints import *
from game_endpoints import *
from sale_house_endpoints import *

from flask_cors import CORS
CORS(app)

if __name__ == '__main__':
    #init_db()
    app.run(port=5000)
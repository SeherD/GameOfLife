from flask_restful import reqparse, Resource, Api
from flask import Flask, g
import sqlite3
import random
from database_init import get_db

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('CertID', type=str)
parser.add_argument('CertName', type=str)
parser.add_argument('IsCert', type=bool)
parser.add_argument('Image', type=str)  # Added Image argument

def format_cert_response(cert_data):
    return {
        "CertID": cert_data[0],
        "CertName": cert_data[1],
        "IsCert": bool(cert_data[2]),
        "Image": cert_data[3],  # Added Image attribute
    }

class CertResource(Resource):
    def get(self, cert_id):
        db = get_db()
        cur = db.execute('SELECT * FROM Certifications WHERE CertID = ?', (cert_id,))
        cert = cur.fetchone()
        if cert is None:
            return {'message': 'Certification or Language not found'}, 404
        return format_cert_response(cert)

    def put(self, cert_id):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute('SELECT * FROM Certifications WHERE CertID = ?', (cert_id,))
        cert = cur.fetchone()
        if cert is None:
            return {'message': 'Certification or Language not found'}, 404

        # Update only the attributes provided in the PUT request
        update_fields = {k: v for k, v in args.items() if v is not None}
        update_query = ', '.join([f"{field}=? " for field in update_fields.keys()])

        if update_query:
            query = f'UPDATE Certifications SET {update_query} WHERE CertID=?'
            db.execute(query, (*update_fields.values(), cert_id))
            db.commit()

        return format_cert_response(cur.lastrowid)

    def delete(self, cert_id):
        db = get_db()
        db.execute('DELETE FROM Certifications WHERE CertID=?', (cert_id,))
        db.commit()
        return {'message': 'Certification or language deleted successfully'}

class CertsResource(Resource):
    def post(self):
        args = parser.parse_args()
        db = get_db()
        cur = db.execute(
            "INSERT INTO Certifications (CertID, CertName, IsCert, Image) VALUES (?, ?, ?, ?)",
            (
                args["CertID"],
                args["CertName"],
                args["IsCert"],
                args["Image"],
            ),
        )
        db.commit()
        return format_cert_response((args["CertID"], args["CertName"], args["IsCert"], args["Image"]))
    
class GetRandCertsResource(Resource):
    def get(self, player_id):
        db = get_db()
        cur = db.execute("SELECT Languages FROM Players WHERE PlayerID = ?", (player_id,))
        player = cur.fetchone()
        if player is None:
            return {"message": "Player not found"}, 404
        
        #Get list of current player language/certifications
        currentCerts = player[0]
        listOfCerts = currentCerts.split(",")

        #Get list of all skills and certifications
        sk = db.execute('SELECT CertID FROM Certifications WHERE IsCert=0')
        skills = sk.fetchall()
        cer = db.execute('SELECT CertID FROM Certifications WHERE IsCert=1')
        certs = cer.fetchall()

        #Check which skills and certs the player already has
        for i in skills:
            if i in listOfCerts:
                skills.remove(i) #Removes skill from list of potential options
        for j in certs:
            if j in listOfCerts:
                certs.remove(j) #Removes certification from list of potential options

        #Grab a random skill and certification to send back
        randomSkill = random.choice(skills)
        randomCert = random.choice(certs)
        rSk = db.execute('SELECT * FROM Certifications WHERE CertID = ?', (randomSkill,))
        skill = rSk.fetchone()
        rCt = db.execute('SELECT * FROM Certifications WHERE CertID = ?', (randomCert,))
        cert = rCt.fetchone()

        if skill is None or cert is None:
            return {'message': 'Certification or Language not found'}, 405

        #Return a JSON array consisting of the skill first, then the certification
        toReturn = [format_cert_response(skill), format_cert_response(cert)]
        return toReturn


api.add_resource(CertResource, "/certifications/<string:cert_id>")
api.add_resource(CertsResource, "/certifications")
api.add_resource(GetRandCertsResource, "/certifications/get-random-certs/<string:player_id>")

if __name__ == '__main__':
    app.run(debug=True)

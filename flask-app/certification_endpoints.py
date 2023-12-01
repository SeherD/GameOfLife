from flask_restful import reqparse, Resource, Api
from flask import Flask, g
import sqlite3
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

api.add_resource(CertResource, "/certifications/<string:cert_id>")
api.add_resource(CertsResource, "/certifications")

if __name__ == '__main__':
    app.run(debug=True)

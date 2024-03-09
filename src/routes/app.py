from flask import Flask, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

app = Flask("Placeranker")

# API Key for HERE API
api_key = "WIyTOweLaqKkQrUl4HmxokjOSf-W2zhXmfUm2Sxd7zc"

# Database connection parameters
DB_HOST = 'localhost'
DB_NAME = 'Placeranker'
DB_USER = 'postgres'
DB_PASSWORD = 'admin123'

def connect_to_database():
    try:
        connection = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            cursor_factory=RealDictCursor
        )
        return connection
    except psycopg2.Error as e:
        print("Error connecting to Placeranker database:", e)
        return None

@app.route('/login/<username>', methods = ['POST'])
def create_user (username):
    conn = connect_to_database()

    body = None
    if request.is_json:
        body = request.json
        password = body["password"]
        

@app.route("/login/<username>/<password>", methods = ['GET'])
def authenticate_user (username, password):
    conn = connect_to_database()
    sql_query = f"SELECT username, password FROM \"Login\" WHERE username = '{username}';"
    cursor = conn.cursor()
    cursor.execute(sql_query)

    rows = cursor.fetchall() 
    actual_password = rows[0]["password"]
    # Password was incorrect
    if (password != actual_password):
        return {}, 401
    else:
        return {}, 200

def get_location_data (query):
    url = f"https://geocode.search.hereapi.com/v1/geocode?q={query}&apiKey={api_key}"
    response = requests.get(url)
    data = response.json()
    return data

# # TO DO once SQL server is set up
# # Location ID is the location ranking in our SQL database
# def update_rank (location_id):


if __name__ == "__main__":
    # get_location_data("Mia Za's Champaign")
    app.run(debug = True)

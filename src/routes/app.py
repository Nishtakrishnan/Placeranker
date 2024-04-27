from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

import pandas as pd
import hashlib
import uuid


app = Flask("Placeranker")
CORS(app)

# API Key for HERE API
api_key = "WIyTOweLaqKkQrUl4HmxokjOSf-W2zhXmfUm2Sxd7zc"

# Database connection parameters
DB_HOST = '192.168.0.87'
DB_NAME = 'placeranker'
DB_USER = 'postgres'
DB_PASSWORD = '1469'

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

@app.route('/create/<username>/', methods = ['POST'])
def create_user (username):
    conn = connect_to_database()

    body = None
    if request.is_json:
        body = request.json
        password = body["password"]
        print(password)
        conn = connect_to_database()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM \"Login\" WHERE username='{}';".format(username))
        frame = pd.DataFrame(cursor.fetchall())
        if (not frame.empty):
            return {"successful" : False}, 401
        sql_query = f"INSERT INTO \"Login\" (username, password) values {(username, password)};"
        cursor = conn.cursor()
        cursor.execute(sql_query)
        conn.commit()
        return {}, 200
    else:
        return {}, 400
    

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
    
@app.route("/friends/<username>", methods = ['GET'])
def get_friends (username):
    conn = connect_to_database()
    sql_query = f"SELECT friends_list FROM \"Friends\" WHERE username = '{username}';"
    cursor = conn.cursor()
    cursor.execute(sql_query)

    rows = cursor.fetchall()[0]["friends_list"]
    return {"friends" : rows}, 200

# From user is the user who accepted the friend request from to_user
@app.route("/friends/<from_user>/<to_user>", methods = ["PUT"])
def add_friends (from_user, to_user):
    conn = connect_to_database()
    # Get the to_user's friend requests
    friend_requests, status = get_friend_requests(from_user)
    friend_requests = friend_requests['requests']
    friends_list, status = get_friends(from_user)
    friends_list = friends_list["friends"]
    # Can't add as friend, no pending request sent or already friends
    if to_user not in friend_requests or to_user in friends_list:
        return {}, 404
    
    # Add each other as friends
    sql_query = f"""UPDATE \"Friends\" SET friends_list = array_append(friends_list, '{from_user}')
                    WHERE username = '{to_user}';"""
    cursor = conn.cursor()
    cursor.execute(sql_query)
    conn.commit()
    sql_query = f"""UPDATE \"Friends\" SET friends_list = array_append(friends_list, '{to_user}')
                    WHERE username = '{from_user}';"""
    cursor = conn.cursor()
    cursor.execute(sql_query)
    conn.commit()
    return {}, 200

@app.route("/requests/<username>", methods = ['GET'])
def get_friend_requests (username):
    conn = connect_to_database()
    sql_query = f"SELECT requests FROM \"Friends\" WHERE username = '{username}';"
    cursor = conn.cursor()
    cursor.execute(sql_query)

    rows = cursor.fetchall()[0]["requests"]
    return {"requests" : rows}, 200

# Sendss a friend request from 'from_user' to 'to_user'
@app.route("/requests/<from_user>/<to_user>", methods = ['PUT'])
def send_friend_request (from_user, to_user):
    conn = connect_to_database()
    friend_requests, status = get_friend_requests(to_user)
    friend_requests = friend_requests['requests']
    # A pending request already exists from 'from_user' to 'to_user'
    if from_user in friend_requests:
        return {}, 404
    sql_query = f"""UPDATE \"Friends\" SET requests = array_append(requests, '{from_user}')
                    WHERE username = '{to_user}';"""
    cursor = conn.cursor()
    cursor.execute(sql_query)
    conn.commit()
    return {}, 200

def get_location_data (query):
    url = f"https://geocode.search.hereapi.com/v1/geocode?q={query}&apiKey={api_key}"
    response = requests.get(url)    
    data = response.json()
    return data


@app.route("/addlocation/<username>", methods = ['POST'])
def update_rank (username):
    if request.is_json:
        conn = connect_to_database()
        location_data = request.json.get("features")
        for location_obj in location_data:
            latitude, longitude = location_obj.get("geometry").get("coordinates")
            location_properties = location_obj.get("properties")
            google_maps_url = location_properties.get("google_maps_url")
            address, location_name = location_properties["location"]["address"], location_properties["location"]["name"]
            # Location_id is the hash of the address (since this will be unique anyway)
            location_id = hashlib.sha256(address.encode()).hexdigest()

            
            sql_query = f"""INSERT INTO \"Places\" (longitude, latitude, location_id, google_maps_url, location_name, address)
                            values {(longitude, latitude, location_id, google_maps_url, location_name, address)}
                            ON CONFLICT (location_id) DO NOTHING;"""
            cursor = conn.cursor()
            cursor.execute(sql_query)
            conn.commit()

            # Also create an entry in the ratings table
            rating_id = str(uuid.uuid4())
            sql_query = f"""INSERT INTO \"Ratings\" (rating_id, username, location_id)
                            values {(rating_id, username, location_id)};""" # For now, JSON doesn't contain ratings/comments so leave them blank
            cursor = conn.cursor()
            cursor.execute(sql_query)
            conn.commit()
    else:
        return {}, 400

if __name__ == "__main__":
    # print(get_location_data("Mia Za's Champaign"))
    app.run(debug = True)

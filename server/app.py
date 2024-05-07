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
here_api_key = "Q8rZy6trVNUfRNqfcnl_2I4opvX6a69fFipEdDAkk9I"
here_app_id = "1yxmXbPtbVLvLBgkFvSy"

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

@app.route('/create/<username>/', methods=['POST'])
def create_user(username):
    conn = connect_to_database()

    if request.is_json:
        body = request.json
        password = body["password"]

        # Check if the username already exists in the Login table
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM \"Login\" WHERE username = %s", (username,))
        if cursor.fetchone():
            return {"successful": False}, 401  # User already exists

        # Insert the new user into the Login table
        cursor.execute("INSERT INTO \"Login\" (username, password) VALUES (%s, %s)", (username, password))
        conn.commit()

        # Insert the new user into the Friends table
        cursor.execute("INSERT INTO \"Friends\" (username, requests, friends_list) VALUES (%s, ARRAY[]::text[], ARRAY[]::text[])", (username,))
        conn.commit()

        return {}, 200  # User created successfully
    else:
        return {}, 400  # Bad request
    
@app.route('/get_ratings/<location_id>/', methods=['GET'])
def get_ratings(location_id):
    conn = connect_to_database()
    sql_query = f"SELECT * FROM \"Ratings\" WHERE location_id = '{location_id}' and rating IS NOT NULL;"
    cursor = conn.cursor()
    cursor.execute(sql_query)
    rows = cursor.fetchall()
    print(rows)
    if rows:  # Check if any rows were returned
        return {"ratings": rows}, 200
    else:
        return {"ratings": []}, 200  # Return an empty list if no rows were returned
    

@app.route('/submit_review/<username>', methods=['POST'])
def submit_review(username):
    if request.is_json:
        review_data = request.get_json()
        location_id = review_data.get('location_id')
        stars = review_data.get('stars')
        review_text = review_data.get('review')
        rating_id = review_data.get("rating_id")

        conn = connect_to_database()
        cursor = conn.cursor()

        # Check if the location exists
        cursor.execute(
            "SELECT * FROM \"Places\" WHERE location_id = %s",
            (location_id,)
        )
        result = cursor.fetchone()

        if result:
            # Insert the review into the "Ratings" table
            cursor.execute(
            "UPDATE \"Ratings\" SET rating = %s, comment = %s WHERE location_id = %s AND username = %s",
            (stars, review_text, location_id, username)
)
            
            conn.commit()
            return jsonify({'message': 'Review submitted successfully'}), 200
        else:
            return jsonify({'error': 'Location not found'}), 404

    return jsonify({'error': 'Invalid request payload'}), 400
  

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
    rows = cursor.fetchall()
    if rows:  # Check if any rows were returned
        return {"friends": rows[0]["friends_list"]}, 200
    else:
        return {"friends": []}, 200  # Return an empty list if no rows were returned

# From user is the user who accepted the friend request from to_user
@app.route("/friends/<from_user>/<to_user>", methods=["PUT"])
def add_friends(from_user, to_user):
    conn = connect_to_database()

    # Remove the requester's username from the incoming friend requests
    sql_query = f"""UPDATE \"Friends\" SET requests = array_remove(requests, '{from_user}')
                    WHERE username = '{to_user}';"""
    cursor = conn.cursor()
    cursor.execute(sql_query)
    conn.commit()

    # Add each other as friends
    sql_query = f"""UPDATE \"Friends\" SET friends_list = array_append(friends_list, '{from_user}')
                    WHERE username = '{to_user}';"""
    cursor.execute(sql_query)
    conn.commit()

    sql_query = f"""UPDATE \"Friends\" SET friends_list = array_append(friends_list, '{to_user}')
                    WHERE username = '{from_user}';"""
    cursor.execute(sql_query)
    conn.commit()

    return {}, 200

@app.route("/requests/<username>", methods = ['GET'])
def get_friend_requests (username):
    conn = connect_to_database()
    sql_query = f"SELECT requests FROM \"Friends\" WHERE username = '{username}';"
    cursor = conn.cursor()
    cursor.execute(sql_query)

    rows = cursor.fetchall()
    if rows:  # Check if any rows were returned
        return {"requests": rows[0]["requests"]}, 200
    else:
        return {"requests": []}, 200  # Return an empty list if no rows were returned
    
@app.route("/search_friends/<search_text>", methods=['GET'])
def search_friends(search_text):
    conn = connect_to_database()
    # Assuming your friends' table is named "Friends" and contains a column named "username"
    sql_query = f"""SELECT username FROM \"Login\" WHERE username ILIKE %s LIMIT 10"""
    cursor = conn.cursor()
    cursor.execute(sql_query, ('%' + search_text + '%',))
    rows = cursor.fetchall()

    # Extract the usernames from the database query results
    usernames = [row['username'] for row in rows]

    return jsonify({'results': usernames}), 200

# Sends a friend request from 'from_user' to 'to_user'
@app.route("/requests/<from_user>/<to_user>", methods = ['PUT'])
def send_friend_request (from_user, to_user):
    print("hello")
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
    url = f"https://geocode.search.hereapi.com/v1/geocode?q={query}&apiKey={here_api_key}"
    # url = f"https://discover.search.hereapi.com/v1/discover?at=40.11008,-88.2293&q={query}&apiKey={here_api_key}"
    response = requests.get(url)    
    data = response.json()
    return data


@app.route("/addlocations/<username>", methods = ['POST'])
def add_locations (username):
    if request.is_json:
        conn = connect_to_database()
        location_data = request.json.get("features")
        for location_obj in location_data:
            latitude, longitude = location_obj.get("geometry").get("coordinates")
            location_properties = location_obj.get("properties")
            google_maps_url = location_properties.get("google_maps_url")
            if ("location" in location_properties):
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
        return {}, 200
    else:
        return {}, 400
    
@app.route("/getlocations/<username>", methods=['GET'])
def get_locations(username):
    conn = connect_to_database()
    sql_query = f"""SELECT location_id, longitude, rating, comment, latitude, google_maps_url, location_name, address 
                    FROM \"Ratings\" NATURAL JOIN \"Places\" 
                    WHERE username = '{username}'"""
    cursor = conn.cursor()
    cursor.execute(sql_query)
    rows = cursor.fetchall()

    # Restructure the response for easier unpacking
    locations = []
    for row in rows:
        location = {
            'location_id': row['location_id'],
            'longitude': row['longitude'],
            'rating': row['rating'],
            'comment': row['comment'],
            'latitude': row['latitude'],
            'google_maps_url': row['google_maps_url'],
            'location_name': row['location_name'],
            'address': row['address']
        }
        locations.append(location)

    response = {"locations": locations}
    print(response)
    return response, 200



if __name__ == "__main__":
    # print(get_location_data("McDonalds Green, Champaign Illinois")["items"][0])
    app.run(debug = True)
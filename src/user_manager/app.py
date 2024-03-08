from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

DB_NAME = "cs222"
DB_USER = "gdurand2"
DB_PASSWORD = "12345678910"
DB_HOST = "localhost"
DB_PORT = "5432"

def connect_to_db():
    try:
        connection = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        return connection
    except Exception as e:
        print("Error connecting to cs222 database:", e)
        return None

@app.route('/get_data')
def get_data():
    connection = connect_to_db()
    if connection is not None:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM cs222;")
            data = cursor.fetchall()
            cursor.close()
            connection.close()
            return jsonify(data)
        except Exception as e:
            return jsonify({"error": "Error fetching data from cs222 database"}), 500
    else:
        return jsonify({"error": "Unable to connect to cs22 database"}), 500

if __name__ == '__main__':
    app.run(debug=True)

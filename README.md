# Placeranker

Placeranker is an application designed to help you discover new spots through friends' recommendations and ratings. You can view your and your friends' Google Maps saved places on a map for proximity and convenience.

## Development

### Getting Started

Before you begin development, ensure you have all the necessary packages installed. You will also need PSQL, the SQL file for the database can be found under the `SQL` directory. Placeranker uses a React frontend served by a Flask backend. The Map/location UI uses MapBox.

#### Backend Setup

Navigate to the `server` directory and install the required Python packages using pip:

```bash
pip install -r requirements.txt
```

#### Frontend Setup

Navigate to the `placeranker` directory and install npm packages:

```bash
cd placeranker
npm install
```

### Running the App

Once you have installed the dependencies, you can start the app.

#### Starting the Backend

Navigate to the `server` directory and run the Python backend:

```bash
cd server
python3 app.py
```

#### Starting the Frontend

Navigate to the `placeranker` directory and run the frontend:

```bash
cd ../placeranker
npm start
```

Now you're ready to start using Placeranker.

### Group members & Work Allocation
#### Akshay Ghosh - In charge of developing the backend functionality for JSON upload and querying user locations. 
#### Georges Durand - Responsible for implementing the friends functionality, including querying friends, adding friends, sending friend requests, and leaving reviews for locations.
#### Neel Khare - Worked on the frontend components for login and connecting them to the backend.
#### Nishta Krishnan - Designed the main page of the app, displaying users' locations, and connecting all frontend components. Additionally, worked on displaying all location data on a map.


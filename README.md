# Placeranker

Placeranker is an application designed to help you discover new locations based on recommendations from your friends and ratings.

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
#### Akshay Ghosh - In charge of working on the backend functionality for the JSON upload, querying user's locations, etc. 
#### Georges Durand - Responsible for working on the friends functionality: querying friends, adding friends, sending a friend request, leaving reviews for locations etc.
#### Neel Khare - Worked on the Login frontend components, connected frontend to the backend for these components, and collaborated with Nishta on the design of the application.
#### Nishta Krishnan - Designed main page of app where users' locations are displayed and also worked on connecting all the frontend components with each other.

from flask import Flask, request, jsonify
import requests

# API Key for HERE API
api_key = "WIyTOweLaqKkQrUl4HmxokjOSf-W2zhXmfUm2Sxd7zc"

def get_location_data (query):
    url = f"https://geocode.search.hereapi.com/v1/geocode?q={query}&apiKey={api_key}"
    response = requests.get(url)
    data = response.json()
    return data

# # TO DO once SQL server is set up
# # Location ID is the location ranking in our SQL database
# def update_rank (location_id):


if __name__ == "__main__":
    get_location_data("Mia Za's Champaign")

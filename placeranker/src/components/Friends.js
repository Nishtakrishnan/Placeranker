import React, { useState, useEffect } from "react";
import { Stack, Typography, TextField, Button } from "@mui/material";
import DropdownMenu from "./DropDownMenu";
import Login from "./Login"

const Friends = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const username = "test1234"; // Replace with the actual username

  useEffect(() => {
    const status = window.localStorage.getItem("login_token");
    console.log(status);
    setLoggedIn(status != null);
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`/search_friends/${searchText}`);
      const data = await response.json();
      // Set the search result based on the API response
      setSearchResult(data.results);
    } catch (error) {
      console.error("Error searching for friends:", error);
    }
  };

  const handleSendFriendRequest = (friendUsername) => async () => {
    try {
      // Send a friend request to the selected friend
      await fetch(`/requests/${username}/${friendUsername}`, {
        method: "PUT",
      });
      // Display a success message
      alert(`Friend request sent to ${friendUsername}`);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(`/friends/${username}`);
      const data = await response.json();
      // Set the friends list based on the API response
      setFriends(data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

  return loggedIn ? (
    <div className="centered">
      <div className="absolute top-4 left-4">
        <DropdownMenu />
      </div>
      <Stack spacing={3}>
        <Typography variant="h4" gutterBottom style={{ color: "black" }}>
          Friends
        </Typography>
        <Typography variant="h6" gutterBottom style={{ color: "black" }}>
          Current Friends
        </Typography>
        {friends.map((friend) => (
          <div key={friend}>
            <Typography style={{ color: "black" }}>
              {friend}
            </Typography>
          </div>
        ))}
        <TextField
          label="Search for a friend"
          variant="outlined"
          value={searchText}
          onChange={handleSearchChange}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        {searchResult && (
          <Stack direction="row" spacing={2}>
            {searchResult.map((friend) => (
              <div key={friend}>
                <Typography style={{ color: "black" }}>
                  Username: {friend}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleSendFriendRequest(friend)}
                >
                  Send Friend Request
                </Button>
              </div>
            ))}
          </Stack>
        )}
      </Stack>
    </div>
  ) : <Login/>
};

export default Friends;

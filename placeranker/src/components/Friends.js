import React, { useState, useEffect } from "react";
import { Stack, Typography, TextField, Button } from "@mui/material";
import DropdownMenu from "./DropDownMenu";
import Login from "./Login"

const Friends = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [friends, setFriends] = useState([])
  const [username, setUsername] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const status = window.localStorage.getItem("login_token");
    console.log(status);
    setLoggedIn(status != null);
    setUsername(status)
  }, []);

  useEffect(() => {
    if (username != "") {
      fetchIncomingRequests()
      fetchFriends()
    }
  }, [username]);  

  const fetchIncomingRequests = async () => {
    try {
      console.log("Figuring out username", username)
      const response = await fetch(`/requests/${username}`);
      const data = await response.json();
      setIncomingRequests(data.requests);
    } catch (error) {
      console.error("Error fetching incoming friend requests:", error);
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

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`/search_friends/${searchText}`);
      const data = await response.json();
      setSearchResult(data.results);
    } catch (error) {
      console.error("Error searching for friends:", error);
    }
  };

  const handleSendFriendRequest = (friendUsername) => async () => {
    try {
      await fetch(`/requests/${username}/${friendUsername}`, {
        method: "PUT",
      });
      alert(`Friend request sent to ${friendUsername}`);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleAcceptFriendRequest = (requesterUsername) => async () => {
    try {
      await fetch(`/friends/${requesterUsername}/${username}`, {
        method: "PUT",
      });
      // Refresh incoming friend requests
      fetchIncomingRequests();
      alert(`Friend request from ${requesterUsername} accepted`);
      window.location.reload();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectFriendRequest = (requesterUsername) => async () => {
    try {
      await fetch(`/requests/${requesterUsername}/${username}`, {
        method: "DELETE",
      });
      // Refresh incoming friend requests
      fetchIncomingRequests();
      window.location.reload();
      alert(`Friend request from ${requesterUsername} rejected`);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

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
          Current Friends:
        </Typography>
        <Stack direction="row" spacing={3}>
          {friends.map((friend) => (
            <div key={friend}>
              <Typography style={{ color: "black" }}>
                {friend}
              </Typography>
            </div>
          ))}
        </Stack>
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
        <Typography variant="h6" gutterBottom style={{ color: "black" }}>
          Incoming Friend Requests
        </Typography>
        {incomingRequests && (
          <Stack direction="column" spacing={2}>
            {incomingRequests.map((requester) => (
              <div key={requester}>
                <Typography variant="h6" style={{ color: "black" }}>
                  From: {requester}
                </Typography>
                <Stack direction = "row" spacing={3}>
                  <Button
                    variant="contained"
                    onClick={handleAcceptFriendRequest(requester)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleRejectFriendRequest(requester)}
                  >
                    Reject
                  </Button>
                </Stack>
              </div>
            ))}
          </Stack>
        )}
      </Stack>
    </div>
  ) : <Login/>
};

export default Friends;
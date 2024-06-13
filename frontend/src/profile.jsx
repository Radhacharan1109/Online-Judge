import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaUserCircle } from "react-icons/fa"; 

const Profile = () => {
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    // Fetch user data from the server
    axios
      .get(`${import.meta.env.VITE_URL1}/profile`, { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }, []);

  return (
    <div className="container">
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary">
              <h3 className="mb-0">
                <FaUser className="me-2" />
                Profile
              </h3>
            </div>
            <div className="card-body text-center">
              <FaUserCircle size={50} className="mb-3" />
              <div className="row mb-3">
                <div className="col">
                  <label className="fw-bold">Username:</label>
                  <p className="card-text d-inline"> {user.username}</p>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label className="fw-bold">Email:</label>
                  <p className="card-text d-inline"> {user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

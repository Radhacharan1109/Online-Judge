import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });

  useEffect(() => {
    // Fetch user data from the server
    axios
      .get(`${import.meta.env.VITE_URL1}/viewprofile`, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data.user);
        setFormData({
          username: response.data.user.username,
          email: response.data.user.email,
        });
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = (e) => {
    e.preventDefault()
    axios
      .put(`${import.meta.env.VITE_URL1}/updateprofile`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data.user);
        setIsEditing(false);
      })
      .catch((error) => {
        console.log("Error updating profile:", error);
      });
  };

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
              <form onSubmit={handleSaveClick}>
                <div className="row mb-3">
                  <div className="col">
                    <label className="fw-bold">Username:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    ) : (
                      <p className="card-text d-inline"> {user.username}</p>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label className="fw-bold">Email:</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    ) : (
                      <p className="card-text d-inline"> {user.email}</p>
                    )}
                  </div>
                </div>
                <div>
                  {isEditing ? (
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  ) : (
                    <button
                      type="button" 
                      className="btn btn-secondary"
                      onClick={(e) => {
                        e.preventDefault(); 
                        handleEditClick();
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminRoute = ({ element }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Make a request to check if the user is an admin
        const response = await axios.get(`${import.meta.env.VITE_URL1}/checkAdmin`, { withCredentials: true });
        if (response.data.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      setRedirect(true);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (redirect) {
      navigate('/home');
      alert('Access denied');
    }
  }, [redirect, navigate]);

  if (isAdmin === null) {
    return <div style={{ minHeight: "100vh" }}>Loading...</div>;
  }

  if (!isAdmin) {
    return null; // Return null while waiting for redirect
  }

  return element;
};

export default AdminRoute;

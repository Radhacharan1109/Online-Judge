import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminRoute = ({ element }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL1}/checkAdmin`, { withCredentials: true });
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      alert('Access denied');
    }
  }, [isAdmin]);

  if (isAdmin === null) {
    return <div style={{minHeight:"100vh"}}>Loading...</div>;
  }

  return isAdmin ? element : <Navigate to="/home" />;
};

export default AdminRoute;

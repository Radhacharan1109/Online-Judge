import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL1}/register`, formData);
      console.log('Registration successful:', response.data);
      // Redirect
      navigate("/login");
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100 " style={{ backgroundColor: 'lightpink'}}>
      <div className="card p-4 w-25 shadow">
        <h2 className="card-title text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <div className="mt-3 text-center">
          <Link to="/login">Already have an account? Login here</Link>
        </div>
      </div>
      <div className="position-absolute top-0 start-50 translate-middle-x">
        <h1 className="display-1 fw-bold text-danger">CodeLane</h1>
      </div>
    </div>
  );
};

export default RegisterForm;

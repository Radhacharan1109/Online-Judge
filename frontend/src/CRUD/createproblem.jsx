import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateProblem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/createproblem', formData);
      console.log('Registration successful:', response.data);
      // Redirect 
      navigate("/home");
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card w-50">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h2 className="card-title">Add Problem</h2>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter Title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Enter Description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="difficulty" className="form-label">Difficulty</label>
              <input
                type="text"
                id="difficulty"
                name="difficulty"
                placeholder="Enter Difficulty"
                className="form-control"
                value={formData.difficulty}
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn btn-success">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default CreateProblem;

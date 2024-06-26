import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProblem = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    testcases: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTestcaseChange = (e, index) => {
    const { name, value } = e.target;
    const updatedTestcases = [...formData.testcases];
    updatedTestcases[index][name] = value;
    setFormData({
      ...formData,
      testcases: updatedTestcases,
    });
  };

  const handleDeleteTestcase = (index) => {
    const updatedTestcases = formData.testcases.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      testcases: updatedTestcases,
    });
  };

  const addTestcase = () => {
    setFormData({
      ...formData,
      testcases: [...formData.testcases, { input: "", output: "" }],
    });
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL1}/getProblem/` + id)
      .then((result) => setFormData(result.data))
      .catch((err) => console.log(err));
  }, [id]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_URL1}/updateProblem/` + id,
        formData
      );
      console.log("Updation successful:", response.data);
      // Redirect
      navigate("/home");
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  return (
    <div className="container mt-5 pt-5" style={{ minHeight: "100vh" }}>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h2 className="card-title">Update Problem</h2>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter Title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                maxLength={40}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
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
              <label htmlFor="difficulty" className="form-label">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                className="form-select"
                value={formData.difficulty}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Difficulty
                </option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <h4>Test Cases</h4>
              {formData.testcases.map((testcase, index) => (
                <div key={index} className="mb-4">
                  <div className="mb-3">
                    <label htmlFor={`input${index}`} className="form-label">
                      Input
                    </label>
                    <input
                      type="text"
                      id={`input${index}`}
                      name="input"
                      placeholder="Enter Input"
                      className="form-control"
                      value={testcase.input}
                      onChange={(e) => handleTestcaseChange(e, index)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor={`output${index}`} className="form-label">
                      Output
                    </label>
                    <input
                      type="text"
                      id={`output${index}`}
                      name="output"
                      placeholder="Enter Output"
                      className="form-control"
                      value={testcase.output}
                      onChange={(e) => handleTestcaseChange(e, index)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteTestcase(index)}
                  >
                    Delete Test Case
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary"
                onClick={addTestcase}
              >
                Add Test Case
              </button>
            </div>
            <button className="btn btn-success mt-4">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProblem;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateProblem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    testcases: [],
  });

  const navigate = useNavigate();

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

  const addTestcase = () => {
    setFormData({
      ...formData,
      testcases: [...formData.testcases, { input: "", output: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Stringify the testcases array before sending it to the server
      const testcasesString = JSON.stringify(formData.testcases);
      const response = await axios.post(
        "http://localhost:5000/createproblem",
        { ...formData, testcases: testcasesString }
      );
      console.log("Problem creation successful:", response.data);
      // Redirect
      navigate("/home");        
    } catch (error) {
      console.error("Error creating problem:", error);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card w-50" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h2 className="card-title">Add Problem</h2>
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
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
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
                <div key={index}>
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
            <button className="btn btn-success mt-3">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProblem;

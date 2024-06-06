import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Compiler = () => {
  const { id } = useParams();
  const outputTabRef = useRef(null); // Reference to the output tab button
  const verdictTabRef = useRef(null); // Reference to the verdict tab button
  const [problem, setProblem] = useState();
  const [formData, setFormData] = useState({
    language: "cpp",
    code: "",
    input: "", // Include input field in form data
    output: "",
    loading: false,
    error: "",
  });
  const [activeTab, setActiveTab] = useState("input"); // State to track active tab

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/getProblem/" + id
        );
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCompile = async (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      loading: true,
      error: "",
      output: "",
    });

    try {
      const response = await axios.post("http://localhost:5000/run", {
        language: formData.language,
        code: formData.code,
        input: formData.input, // Include input data
      });
      setFormData({
        ...formData,
        output: response.data.output,
        error: "",
        loading: false,
      });
      // After compilation,click the output tab button
      outputTabRef.current.click();
    } catch (err) {
      const errorMsg = err.response
        ? JSON.stringify(err.response.data)
        : "An error occurred while compiling the code.";
      setFormData({
        ...formData,
        error: errorMsg,
        output: "",
        loading: false,
      });
      outputTabRef.current.click();
    }
  };

  const handleVerdict = () => {
    // click the verdict tab button
    verdictTabRef.current.click();
  };

  const toggleTab = (tabName) => {
    setActiveTab(tabName);
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <h2>{problem.title}</h2>
          <p>{problem.description}</p>
        </div>

        <div className="col-md-6">
          <h1>Compiler</h1>

          <div className="mb-3">
            <form onSubmit={handleCompile}>
              <div className="mb-3">
                <label htmlFor="languageSelect" className="form-label">
                  Select Language
                </label>
                <select
                  id="languageSelect"
                  className="form-select"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="py">Python</option>
                  <option value="c">C</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="codeTextarea" className="form-label">
                  Code
                </label>
                <textarea
                  id="codeTextarea"
                  className="form-control"
                  rows={10}
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Enter your code here"
                />
              </div>
            </form>
          </div>

          {/* Toggle Tabs at Top */}
          <div className="tabs mb-4">
            <button
              className={`tab ${activeTab === "input" ? "active" : ""}`}
              onClick={() => toggleTab("input")}
            >
              Input
            </button>
            <button
              ref={outputTabRef}
              className={`tab ${activeTab === "output" ? "active" : ""}`}
              onClick={() => toggleTab("output")}
            >
              Output
            </button>
            <button
              ref={verdictTabRef}
              className={`tab ${activeTab === "verdict" ? "active" : ""}`}
              onClick={() => toggleTab("verdict")}
            >
              Verdict
            </button>
          </div>

          {/* Content for Input, Output, and Verdict */}
          <div className="row">
            <div className="col-md-12">
              <div className="content">
                {activeTab === "input" && (
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder={
                      formData.language === "py"
                        ? "For Python, write different inputs on different lines..."
                        : "Enter input here..."
                    }
                    value={formData.input}
                    onChange={handleChange}
                    name="input"
                  />
                )}
                {activeTab === "output" && (
                  <div>
                    {formData.output && (
                      <div className="alert alert-success">
                        {formData.output}
                      </div>
                    )}
                    {formData.error && (
                      <div className="alert alert-danger">{formData.error}</div>
                    )}
                    {!formData.output && !formData.error && (
                      <pre>Output will appear here...</pre>
                    )}
                  </div>
                )}

                {activeTab === "verdict" && (
                  <div className="verdict">
                    {/*content for verdict here */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compile Button */}
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={formData.loading}
              onClick={handleCompile}
            >
              {formData.loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>{" "}
                  Compiling...
                </>
              ) : (
                "Compile"
              )}
            </button>
            {/* Submit Button */}
            <button
              type="button"
              className="btn btn-success"
              onClick={handleVerdict}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;

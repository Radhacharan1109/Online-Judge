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
    input: "",
    output: "",
    loading: false,
    error: "",
  });
  const [activeTab, setActiveTab] = useState("input"); // State to track active tab
  const [verdict, setVerdict] = useState({ loading: false, overallVerdict: null, testResults: [] });
  const [username, setUsername] = useState(""); // State to store username

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL1}/getProblem/` + id);
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchProblem();
  }, [id]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL1}/viewprofile`, { withCredentials: true });
        setUsername(response.data.user.username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUsername();
  }, []);

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
      const response = await axios.post(`${import.meta.env.VITE_URL2}/run`, {
        language: formData.language,
        code: formData.code,
        input: formData.input,
      });
      setFormData({
        ...formData,
        output: response.data.output,
        error: "",
        loading: false,
      });
      // After compilation, click the output tab button
      outputTabRef.current.click();
    } catch (err) {
      const errorMsg = err.response
        ? err.response?.data?.error
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

  const handleVerdict = async () => {
    try {
      setVerdict({ ...verdict, loading: true });
      const response = await axios.post(`${import.meta.env.VITE_URL2}/verdict/` + id, {
        code: formData.code,
        language: formData.language,
      });
      setVerdict({ ...response.data, loading: false });
      verdictTabRef.current.click();

      // If verdict is success, add submission to backend
      if (response.data.overallVerdict) {
        const submissionData = {
          username: username,
          problemTitle: problem.title,
          language: formData.language,
          submissionTime: new Date().toISOString(),
        };
        await axios.post(`${import.meta.env.VITE_URL1}/addSubmission`, submissionData);
        console.log("Submission added successfully.");
      }
    } catch (error) {
      console.error("Error fetching verdict:", error);
      setVerdict({
        loading: false,
        overallVerdict: null,
        testResults: [],
        error: error.response ? error.response?.data?.error : "An error occurred while compiling the code.",
      });
      verdictTabRef.current.click();
    }
  };

  const toggleTab = (tabName) => {
    setActiveTab(tabName);
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  // Extract the first test case for sample input and output
  const sampleInput = problem.testcases.length > 0 ? problem.testcases[0].input : "";
  const sampleOutput = problem.testcases.length > 0 ? problem.testcases[0].output : "";

  return (
    <div className="container mt-4" style={{ minHeight: "100vh" }}>
      <div className="row">
        <div className="col-md-6">
          <h1>{problem.title}</h1>
          <br></br>
          <textarea
            className="form-control"
            rows={14}
            readOnly 
            value={problem.description}
          />
          {problem.testcases.length>0 && (
          <div className="mt-3">
            <h5>Sample Input</h5>
            <pre className="form-control" readOnly>{sampleInput}</pre>
            <h5>Sample Output</h5>
            <pre className="form-control" readOnly>{sampleOutput}</pre>
          </div>)}
        </div>

        <div className="col-md-6">
          <h2>Compiler</h2>

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
                    placeholder={"Enter input here..."}
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
                    {verdict.loading ? (
                      <div>Loading...</div>
                    ) : (
                      <div>
                        {verdict.error ? (
                          <div className="alert alert-danger">{verdict.error}</div>
                        ) : verdict.overallVerdict !== null ? (
                          <div className={`alert ${verdict.overallVerdict ? "alert-success" : "alert-danger"}`}>
                            {verdict.overallVerdict ? "Success" : "Failed"}
                          </div>
                        ) : (
                          <pre>Verdict will appear here...</pre>
                        )}
                        {!verdict.overallVerdict && verdict.testResults.length > 0 && (
                          <div className="alert alert-danger">
                            <strong>Failed Test Case:</strong><br />
                            Input: {verdict.testResults[verdict.testResults.length - 1].input}<br />
                            Expected Output: {verdict.testResults[verdict.testResults.length - 1].expectedOutput}<br />
                            Generated Output: {verdict.testResults[verdict.testResults.length - 1].generatedOutput}<br />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-3">
            {/* Compile Button */}
            <button
              type="submit"
              className="btn btn-warning me-2"
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
                "Run"
              )}
            </button>
            {/* Submit Button */}
            <button
              type="button"
              className="btn btn-success"
              onClick={handleVerdict}
              disabled={verdict.loading}
            >
              {verdict.loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>{" "}
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;

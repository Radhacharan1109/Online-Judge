import React, { useState, useEffect } from "react";
import axios from "axios";

const SubmissionTable = () => {
  const [submissions, setSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    username: "",
    problemTitle: "",
  });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL1}/getSubmissions`);
        // Reverse submissions based on submissionTime before setting state
        const reversedSubmissions = response.data.reverse();
        setSubmissions(reversedSubmissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchSubmissions();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const filteredSubmissions = submissions.filter((submission) => {
    return (
      submission.username.toLowerCase().includes(searchQuery.username.toLowerCase()) &&
      submission.problemTitle.toLowerCase().includes(searchQuery.problemTitle.toLowerCase())
    );
  });

  return (
    <div className="container mt-4" style={{ minHeight: "100vh", overflow: "auto" }}>
      <div className="w-100 my-4">
      <div className="mb-3 d-flex justify-content-start">
        <div className="me-2">
          <input
            type="text"
            name="username"
            placeholder="Search by Username"
            value={searchQuery.username}
            onChange={handleSearch}
            className="form-control"
            style={{ maxWidth: "300px" }}
          />
        </div>  
        <div>
          <input
            type="text"
            name="problemTitle"
            placeholder="Search by Problem Title"
            value={searchQuery.problemTitle}
            onChange={handleSearch}
            className="form-control"
            style={{ maxWidth: "300px" }}
          />
        </div>
      </div>
      <div style={{ maxHeight: "550px", overflowY: "auto" }}>
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Username</th>
              <th>Problem Title</th>
              <th>Language</th>
              <th>Submission Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission) => (
              <tr key={submission._id}>
                <td>{submission.username}</td>
                <td>{submission.problemTitle}</td>
                <td>{submission.language}</td>
                <td>{new Date(submission.submissionTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTable;

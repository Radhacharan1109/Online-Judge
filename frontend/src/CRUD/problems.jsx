import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    difficulty: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL1}/readproblems`)
      .then((result) => setProblems(result.data))
      .catch((err) => console.log(err));

      fetchAdminStatus();
  }, []);

  const fetchAdminStatus = async () => {
    try {
      // Make a request to check if the user is an admin
      const response = await axios.get(`${import.meta.env.VITE_URL1}/checkAdmin`, { withCredentials: true });
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      setIsAdmin(false);
      console.error("Error checking admin status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
     const adminResponse = await axios.get(`${import.meta.env.VITE_URL1}/checkAdmin`, { withCredentials: true });
    
     if (!adminResponse.data.isAdmin) {
      alert("Access denied. You must be an admin to delete problems.");
      return;
     }
      const response = await axios.delete(
        `${import.meta.env.VITE_URL1}/deleteProblem/` + id
      );
      console.log("Deletion successful:", response.data);
      setProblems(problems.filter((problem) => problem._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const filteredProblems = problems.filter((problem) => {
    return (
      problem.title.toLowerCase().includes(searchQuery.title.toLowerCase()) &&
      (searchQuery.difficulty === "" || problem.difficulty.toLowerCase() === searchQuery.difficulty.toLowerCase())
    );
  });

  return (
    <div className="container-fluid vh-100 d-flex flex-column align-items-center">
      <div className="w-100 my-4">
        <div className="mb-3 d-flex justify-content-start">
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery.title}
            onChange={(e) => setSearchQuery({ ...searchQuery, title: e.target.value })}
            className="form-control me-2"
            style={{ maxWidth: "300px" }}
          />
          <select
            value={searchQuery.difficulty}
            onChange={(e) => setSearchQuery({ ...searchQuery, difficulty: e.target.value })}
            className="form-control"
            style={{ maxWidth: "300px" }}
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div style={{ maxHeight: "550px", overflowY: "auto" }}>
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>S.No.</th>
                <th>Title</th>
                <th style={{ width: "700px" }}>Description</th>
                <th>Difficulty</th>
                {isAdmin && (<th>Actions</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem, index) => (
                <tr key={problem._id}>
                  <td>{index + 1}</td>
                  <td style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <Link to={`../compiler/${problem._id}`}>{problem.title}</Link>
                  </td>
                  <td style={{ maxWidth: "700px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <div style={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {problem.description}
                    </div>
                  </td>
                  <td>{problem.difficulty}</td>                  
                  {isAdmin && ( // Render admin actions if user is admin
                  <td>
                   <>
                    <Link to={`../update/${problem._id}`} className="btn btn-warning me-2">
                      Update
                    </Link>                    
                    <button className="btn btn-danger" onClick={() => handleDelete(problem._id)}>
                      Delete
                    </button>
                   </>
                  </td>
                  )}                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problems;

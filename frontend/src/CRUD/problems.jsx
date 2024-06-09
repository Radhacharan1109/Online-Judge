import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Problems = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/readproblems")
      .then((result) => setProblems(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/deleteProblem/" + id
      );
      console.log("Deletion successful:", response.data);
      // Removing the problem from the state instead of reloading the page as it may take some time
      setProblems(problems.filter((problem) => problem._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column align-items-center">
      <div className="w-100 my-4">
        <table className="table table-hover table-bordered" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id}>
                <td>
                  <Link to={`compiler/${problem._id}`} >
                    {problem.title}
                  </Link>
                </td>
                <td>{problem.description}</td>
                <td>{problem.difficulty}</td>
                <td>
                  <Link
                    to={`update/${problem._id}`}
                    className="btn btn-warning me-2"
                  >
                    Update
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(problem._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Problems;

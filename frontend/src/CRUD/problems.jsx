import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Problems = () => {
  const [Problems, setProblems] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/readproblems")
      .then((result) => setProblems(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handledelete = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/deleteProblem/" + id
      );
      console.log("Deletion successful:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card w-75">
        <div className="card-body">
          <Link to="create" className="btn btn-success mb-3">
            Add +
          </Link>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Problems.map((problem) => {
                return (
                  <tr key={problem._id}>
                    <td>
                      <Link to={`compiler/${problem._id}`}>
                        {problem.title}
                      </Link>
                    </td>
                    <td>{problem.description}</td>
                    <td>{problem.difficulty}</td>
                    <td>
                      <Link
                        to={`update/${problem._id}`}
                        className="btn btn-success me-2"
                      >
                        Update
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handledelete(problem._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Problems;

import React,{useState,useEffect} from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProblem = () => {
  const {id}= useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/getProblem/"+id)
      .then((result) => setFormData(result.data))
      .catch((err) => console.log(err))
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:5000/updateProblem/"+id, formData);//put for updation
      console.log('Updation successful:', response.data);
      // Redirect 
      navigate("/home");
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card w-50">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h2 className="card-title">Update Problem</h2>
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
            <button className="btn btn-success">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default UpdateProblem;

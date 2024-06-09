import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/navbar";
import CreateProblem from "./CRUD/createproblem";
import UpdateProblem from "./CRUD/updateproblem";
import Problems from "./CRUD/problems";
import Compiler from "./compiler";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/compiler/:id" element={<Compiler />} />
          <Route path="/create" element={<CreateProblem />} />
          <Route path="/update/:id" element={<UpdateProblem />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/" element={<Problems />} /> {/* Default Route */}
        </Routes>
      </div>
    </div>
  );
};

export default Home;

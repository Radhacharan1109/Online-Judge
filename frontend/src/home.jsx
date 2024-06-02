import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CreateProblem from "./CRUD/createproblem";
import UpdateProblem from "./CRUD/updateproblem";
import Problems from "./CRUD/problems";

const Home = () => {
  return (
    <Routes>
      <Route path="create" element={<CreateProblem />} />
      <Route path="update/:id" element={<UpdateProblem />} />
      <Route path="problems" element={<Problems />} />
      <Route path="/" element={<Problems />} /> {/*Default Route*/}
      {/*switch exchanges with routes*/}
    </Routes>
  );
};

export default Home;

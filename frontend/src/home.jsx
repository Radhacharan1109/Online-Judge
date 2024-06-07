import React from "react";
import { Route, Routes } from "react-router-dom";
import CreateProblem from "./CRUD/createproblem";
import UpdateProblem from "./CRUD/updateproblem";
import Problems from "./CRUD/problems";
import Compiler from "./compiler";

const Home = () => {
  return (
    <Routes>
      <Route path="/compiler/:id" element={<Compiler />} />
      <Route path="/create" element={<CreateProblem />} />
      <Route path="/update/:id" element={<UpdateProblem />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/" element={<Problems />} /> {/*Default Route*/}
    </Routes>
  );
};

export default Home;

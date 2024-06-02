import React from "react";
import LoginForm from "./login";
import RegisterForm from "./register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/" element={<LoginForm />} /> {/*Default Route*/}
      </Routes>
      {/*switch exchanges with routes*/}
    </Router>
  );
};

export default App;

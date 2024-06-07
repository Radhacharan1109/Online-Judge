import React from "react";
import LoginForm from "./login";
import RegisterForm from "./register";
import ProtectedRoute from "./Protected/protected";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home/*" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/" element={<LoginForm />} /> {/*Default Route*/}
      </Routes>
    </Router>
  );
};

export default App;

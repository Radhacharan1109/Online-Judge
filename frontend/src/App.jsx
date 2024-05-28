import React from 'react';
import LoginForm from './login';
import RegisterForm from './register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<LoginForm />} /> {/*Default Route*/}
      </Routes>{/*switch exchanges with routes*/}
    </Router>
  );
};

export default App;

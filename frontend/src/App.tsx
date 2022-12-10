import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { CreateCard } from "./pages/CreateCard";


function App() {
  return (
      <div>
       <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCard />} />
        </Routes>
      </Router>
      </div>
  );
}

export default App;

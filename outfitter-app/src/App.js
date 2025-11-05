import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Suggestion from './pages/Suggestion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suggestion" element={<Suggestion />} />
      </Routes>
    </Router>
  );
}

export default App;

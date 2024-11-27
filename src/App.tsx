import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Prototype1 from './prototype_1/src/Prototype_1';
import Prototype2 from './prototype_2/src/Prototype_2';
import Prototype3 from './prototype_3/src/Prototype_3';
import Prototype4 from './prototype_4/src/Prototype_4';

const App = () => {
  const [isNavVisible, setIsNavVisible] = useState(true); // State to toggle navigation visibility

  const toggleNav = () => {
    setIsNavVisible((prev) => !prev);
  };

  return (
    <Router>
      <div className="app-container">
      

        {/* Navigation Bar */}
        {isNavVisible && (
          <nav className="navigation">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/prototype1">Prototype 1</Link></li>
              <li><Link to="/prototype2">Prototype 2</Link></li>
              <li><Link to="/prototype3">Prototype 3</Link></li>
              <li><Link to="/prototype4">Prototype 4</Link></li>
            </ul>
          </nav>
        )}
        {/* Toggle Button */}
        <button className="toggle-nav" onClick={toggleNav}>
          {isNavVisible ? 'Hide Navigation' : 'Show Navigation'}
        </button>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<h1>Welcome to the Map Prototypes</h1>} />
          <Route path="/prototype1" element={<Prototype1 />} />
          <Route path="/prototype2" element={<Prototype2 />} />
          <Route path="/prototype3" element={<Prototype3 />} />
          <Route path="/prototype4" element={<Prototype4 />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
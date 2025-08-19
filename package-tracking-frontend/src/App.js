import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PackageList from './components/PackageList';
import PackageDetails from './components/PackageDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<PackageList />} />
          <Route path="/package/:id" element={<PackageDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

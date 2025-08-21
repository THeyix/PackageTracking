import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PackageList from './components/PackageList';
import PackageDetails from './components/PackageDetails';
import CreatePackage from './components/CreatePackage';
import './App.css';

function App() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePackageCreated = () => {
    setShowCreateModal(false); // Close the modal
    setRefreshKey(prevKey => prevKey + 1); // Trigger a refresh
  };

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={
              <PackageList key={refreshKey} onCreatePackage={() => setShowCreateModal(true)} />
            } />
            <Route path="/package/:id" element={<PackageDetails />} />
          </Routes>
          
          {/* The create modal is shown conditionally based on state */}
          {showCreateModal && (
            <CreatePackage
              onClose={() => setShowCreateModal(false)}
              onPackageCreated={handlePackageCreated}
            />
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { packageAPI } from '../services/api';
import { PACKAGE_STATUS, STATUS_NAMES } from '../constants/packageStatus';
import PackageCard from './PackageCard';
import CreatePackageModal from './CreatePackageModal';
import StatusUpdateModal from './StatusUpdateModal';

const PackageList = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [trackingFilter, setTrackingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await packageAPI.getAllPackages();
      setPackages(response.data);
    } catch (err) {
      setError('Failed to fetch packages');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await packageAPI.searchPackages(
        trackingFilter || undefined,
        statusFilter !== '' ? parseInt(statusFilter) : undefined
      );
      setPackages(response.data);
    } catch (err) {
      setError('Failed to search packages');
      console.error('Error searching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setTrackingFilter('');
    setStatusFilter('');
    fetchPackages();
  };

  const handlePackageCreated = (newPackage) => {
    setPackages(prev => [newPackage, ...prev]);
  };

  const handleViewDetails = (pkg) => {
    navigate(`/package/${pkg.id}`);
  };

  const handleUpdateStatus = (pkg) => {
    setSelectedPackage(pkg);
    setShowUpdateModal(true);
  };

  const handleStatusUpdated = () => {
    setShowUpdateModal(false);
    setSelectedPackage(null);
    fetchPackages(); // Refresh the list
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Package Tracking</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Package
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by Tracking Number
            </label>
            <input
              type="text"
              value={trackingFilter}
              onChange={(e) => setTrackingFilter(e.target.value)}
              placeholder="Enter tracking number..."
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_NAMES).map(([value, name]) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={handleClearFilters}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading packages...</div>
        </div>
      )}

      {/* Packages List */}
      {!loading && packages.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-600">No packages found. Create your first package to get started!</div>
        </div>
      )}

      {!loading && packages.length > 0 && (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            Found {packages.length} package{packages.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <CreatePackageModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPackageCreated={handlePackageCreated}
      />

      <StatusUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        package={selectedPackage}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
};

export default PackageList;

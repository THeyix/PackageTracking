import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packageAPI } from '../services/api';
import { STATUS_NAMES, STATUS_COLORS, getAvailableTransitions } from '../constants/packageStatus';
import StatusUpdateModal from './StatusUpdateModal';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [package_, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const response = await packageAPI.getPackageById(id);
      setPackage(response.data);
    } catch (err) {
      setError('Package not found');
      console.error('Error fetching package details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdated = () => {
    setShowUpdateModal(false);
    fetchPackageDetails();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !package_) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Package not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Packages
        </button>
      </div>
    );
  }

  const availableTransitions = getAvailableTransitions(package_.currentStatus);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Package Details</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Packages
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Package Information</h2>
              <div className="space-y-2">
                <p><strong>Tracking Number:</strong> {package_.trackingNumber}</p>
                <p><strong>Created Date:</strong> {formatDate(package_.createdDate)}</p>
                <p><strong>Last Updated:</strong> {formatDate(package_.lastUpdated)}</p>
                <p>
                  <strong>Current Status:</strong>{' '}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[package_.currentStatus]}`}>
                    {STATUS_NAMES[package_.currentStatus]}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              {availableTransitions.length > 0 && (
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update Status
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Sender Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {package_.senderName}</p>
              <p><strong>Address:</strong> {package_.senderAddress}</p>
              <p><strong>Phone:</strong> {package_.senderPhone}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recipient Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {package_.recipientName}</p>
              <p><strong>Address:</strong> {package_.recipientAddress}</p>
              <p><strong>Phone:</strong> {package_.recipientPhone}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Status History</h2>
          <div className="space-y-4">
            {package_.statusHistories
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((history, index) => (
                <div key={history.id || index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[history.status]}`}>
                    {STATUS_NAMES[history.status]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{formatDate(history.timestamp)}</p>
                    {history.notes && (
                      <p className="text-gray-600 text-sm mt-1">{history.notes}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <StatusUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        package={package_}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
};

export default PackageDetails;

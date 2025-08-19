import React, { useState } from 'react';
import { packageAPI } from '../services/api';

const CreatePackageModal = ({ isOpen, onClose, onPackageCreated }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderAddress: '',
    senderPhone: '',
    recipientName: '',
    recipientAddress: '',
    recipientPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await packageAPI.createPackage(formData);
      onPackageCreated(response.data);
      onClose();
      setFormData({
        senderName: '',
        senderAddress: '',
        senderPhone: '',
        recipientName: '',
        recipientAddress: '',
        recipientPhone: '',
      });
    } catch (err) {
      setError('Failed to create package. Please try again.');
      console.error('Error creating package:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Package</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Sender Information</h3>
            <div className="space-y-2">
              <input
                type="text"
                name="senderName"
                placeholder="Sender Name"
                value={formData.senderName}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="senderAddress"
                placeholder="Sender Address"
                value={formData.senderAddress}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="tel"
                name="senderPhone"
                placeholder="Sender Phone"
                value={formData.senderPhone}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Recipient Information</h3>
            <div className="space-y-2">
              <input
                type="text"
                name="recipientName"
                placeholder="Recipient Name"
                value={formData.recipientName}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="recipientAddress"
                placeholder="Recipient Address"
                value={formData.recipientAddress}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="tel"
                name="recipientPhone"
                placeholder="Recipient Phone"
                value={formData.recipientPhone}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePackageModal;

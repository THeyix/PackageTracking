import React from 'react';
import { STATUS_NAMES, STATUS_COLORS, getAvailableTransitions } from '../constants/packageStatus';

const PackageCard = ({ package: pkg, onViewDetails, onUpdateStatus }) => {
  const availableTransitions = getAvailableTransitions(pkg.currentStatus);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {pkg.trackingNumber}
          </h3>
          <p className="text-sm text-gray-600">
            Created: {formatDate(pkg.createdDate)}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[pkg.currentStatus]}`}>
          {STATUS_NAMES[pkg.currentStatus]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-gray-700">From:</h4>
          <p className="text-sm text-gray-600">{pkg.senderName}</p>
          <p className="text-sm text-gray-600">{pkg.senderAddress}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">To:</h4>
          <p className="text-sm text-gray-600">{pkg.recipientName}</p>
          <p className="text-sm text-gray-600">{pkg.recipientAddress}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => onViewDetails(pkg)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </button>
        
        {availableTransitions.length > 0 && (
          <button
            onClick={() => onUpdateStatus(pkg)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Update Status
          </button>
        )}
      </div>
    </div>
  );
};

export default PackageCard;

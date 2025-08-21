import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, PackageStatus } from '../types/package';
import * as packageService from '../services/packageService';
import { getStatusDisplayName, getStatusColor, formatDate } from '../utils/packageUtils';

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [validTransitions, setValidTransitions] = useState<PackageStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = useCallback(async () => {
    if (!id) {
      setError("Package ID is missing from the URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const packageId = parseInt(id);
      const [packageData, transitionsData] = await Promise.all([
        packageService.getPackageById(packageId),
        packageService.getValidStatusTransitions(packageId)
      ]);
      setPkg(packageData);
      setValidTransitions(transitionsData);
    } catch (err) {
      setError("Failed to load package details. It may not exist.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleStatusUpdate = async (newStatus: PackageStatus) => {
    if (!pkg) return;
    const statusName = getStatusDisplayName(newStatus);
    if (window.confirm(`Are you sure you want to change status to "${statusName}"?`)) {
      try {
        await packageService.updatePackageStatus(pkg.id, { newStatus });
        alert("Status updated successfully!");
        loadDetails();
      } catch (err) {
        alert("Failed to update status. Please try again.");
      }
    }
  };

  if (loading) return <div className="text-center p-10">Loading package details...</div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">{error}</div>;
  if (!pkg) return <div className="text-center p-10">Package not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/')} className="text-blue-500 hover:underline font-medium">&larr; Back to Package List</button>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{pkg.trackingNumber}</h1>
                <p className="text-gray-500">Created on: {formatDate(pkg.createdAt)}</p>
            </div>
            <span className={`text-base font-semibold px-3 py-1 rounded-full ${getStatusColor(pkg.currentStatus)}`}>
                {getStatusDisplayName(pkg.currentStatus)}
            </span>
        </div>

        {validTransitions.length > 0 && (
          <div className="my-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Available Actions:</h3>
            <div className="flex flex-wrap gap-2">
              {validTransitions.map(status => (
                <button 
                  key={status} 
                  onClick={() => handleStatusUpdate(status)}
                  className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow hover:opacity-90 transition-opacity ${getStatusColor(status).replace('bg-', 'bg-').replace('-100', '-500')}`}
                >
                  Mark as {getStatusDisplayName(status)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Sender</h3>
                <p className="text-gray-700">{pkg.senderName}</p>
                <p className="text-gray-700">{pkg.senderAddress}</p>
                <p className="text-gray-700">{pkg.senderPhone}</p>
            </div>
            <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Recipient</h3>
                <p className="text-gray-700">{pkg.recipientName}</p>
                <p className="text-gray-700">{pkg.recipientAddress}</p>
                <p className="text-gray-700">{pkg.recipientPhone}</p>
            </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Status Timeline</h2>
          <div className="border-l-2 border-blue-500 ml-2">
            {pkg.statusHistory.map((h, index) => (
              <div key={h.id} className="relative mb-6">
                <div className="absolute -left-[11px] top-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
                <div className="ml-8">
                  <span className={`font-semibold px-2 py-0.5 rounded text-xs ${getStatusColor(h.status)}`}>{getStatusDisplayName(h.status)}</span>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(h.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, PackageStatus } from '../types/package';
import * as packageService from '../services/packageService';
import { getStatusDisplayName, getStatusColor, formatDate } from '../utils/packageUtils';

interface PackageListProps {
  onCreatePackage: () => void;
}

const PackageList: React.FC<PackageListProps> = ({ onCreatePackage }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [trackingNumberFilter, setTrackingNumberFilter] = useState('');

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = statusFilter ? (parseInt(statusFilter) as PackageStatus) : undefined;
      const data = await packageService.getAllPackages(status);
      setPackages(data);
    } catch (err) {
      setError('Failed to load packages. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  const handleStatusUpdate = async (packageId: number, newStatus: PackageStatus) => {
    const statusName = getStatusDisplayName(newStatus);

    if (window.confirm(`Are you sure you want to change the status to "${statusName}"?`)) {
      try {
        await packageService.updatePackageStatus(packageId, { newStatus });
        alert('Status updated successfully!');
        loadPackages();
      } catch (err) {
        alert('Failed to update status. The transition may not be allowed.');
      }
    }
  };

  const getQuickActions = (pkg: Package) => {
    switch (pkg.currentStatus) {
      case PackageStatus.Created:
        return (
          <>
            <button onClick={() => handleStatusUpdate(pkg.id, PackageStatus.Sent)} className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600">Sent</button>
            <button onClick={() => handleStatusUpdate(pkg.id, PackageStatus.Canceled)} className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600">Cancel</button>
          </>
        );
      case PackageStatus.Sent:
         return (
          <>
            <button onClick={() => handleStatusUpdate(pkg.id, PackageStatus.Accepted)} className="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600">Accept</button>
            <button onClick={() => handleStatusUpdate(pkg.id, PackageStatus.Returned)} className="bg-yellow-500 text-black px-2 py-1 text-xs rounded hover:bg-yellow-600">Return</button>
            <button onClick={() => handleStatusUpdate(pkg.id, PackageStatus.Canceled)} className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600">Cancel</button>
          </>
        );
      case PackageStatus.Returned:
        return (
          <>
            <button onClick={() => handleStatusUpdate(pkg.id, PackageStatus.Sent)} className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600">Resend</button>
            <button onClick={() => handleStatusUpdate(pkg.id, PackageStatus.Canceled)} className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600">Cancel</button>
          </>
        );
      default:
        return <span className="text-xs text-gray-500">Final Status</span>;
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.trackingNumber.toLowerCase().includes(trackingNumberFilter.toLowerCase())
  );
  
  if (loading) return <div className="text-center p-10">Loading packages...</div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Package Tracking</h1>
        <button onClick={onCreatePackage} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Create New Package
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
            type="text"
            placeholder="Search by Tracking Number..."
            value={trackingNumberFilter}
            onChange={e => setTrackingNumberFilter(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Filter by All Statuses</option>
            {Object.entries(PackageStatus)
                .filter(([key]) => isNaN(Number(key)))
                .map(([key, value]) => (
                    <option key={value} value={value}>{key}</option>
            ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.length > 0 ? filteredPackages.map(pkg => (
          <div key={pkg.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-gray-800">{pkg.trackingNumber}</h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(pkg.currentStatus)}`}>
                {getStatusDisplayName(pkg.currentStatus)}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p><span className="font-medium">From:</span> {pkg.senderName}</p>
                <p><span className="font-medium">To:</span> {pkg.recipientName}</p>
                <p><span className="font-medium">Created:</span> {formatDate(pkg.createdAt)}</p>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <div className="space-x-2">{getQuickActions(pkg)}</div>
              <Link to={`/package/${pkg.id}`} className="text-blue-500 hover:underline text-sm font-medium">View Details</Link>
            </div>
          </div>
        )) : (
            <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No packages found matching your criteria.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default PackageList;

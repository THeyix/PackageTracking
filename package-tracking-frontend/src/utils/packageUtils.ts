import { PackageStatus } from '../types/package';

export const getStatusDisplayName = (status: PackageStatus): string => {
  switch (status) {
    case PackageStatus.Created: return 'Created';
    case PackageStatus.Sent: return 'Sent';
    case PackageStatus.Accepted: return 'Accepted';
    case PackageStatus.Returned: return 'Returned';
    case PackageStatus.Canceled: return 'Canceled';
    default: return 'Unknown';
  }
};

export const getStatusColor = (status: PackageStatus): string => {
  switch (status) {
    case PackageStatus.Created: return 'bg-gray-100 text-gray-800';
    case PackageStatus.Sent: return 'bg-blue-100 text-blue-800';
    case PackageStatus.Accepted: return 'bg-green-100 text-green-800';
    case PackageStatus.Returned: return 'bg-yellow-100 text-yellow-800';
    case PackageStatus.Canceled: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5040/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const packageAPI = {
  getAllPackages: () => api.get('/packages'),
  
  getPackageById: (id) => api.get(`/packages/${id}`),
  
  getPackageByTracking: (trackingNumber) => api.get(`/packages/tracking/${trackingNumber}`),
  
  createPackage: (packageData) => api.post('/packages', packageData),
  
  updatePackageStatus: (id, statusData) => api.put(`/packages/${id}/status`, statusData),
  
  searchPackages: (trackingNumber, status) => {
    const params = new URLSearchParams();
    if (trackingNumber) params.append('trackingNumber', trackingNumber);
    if (status !== undefined && status !== '') params.append('status', status);
    return api.get(`/packages?${params.toString()}`);
  }
};

export default api;

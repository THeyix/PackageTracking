import axios from 'axios';
import { Package, CreatePackageRequest, UpdateStatusRequest, PackageStatus } from '../types/package';

const API_URL = 'http://localhost:5167/api/packages';

export const getAllPackages = async (status?: PackageStatus): Promise<Package[]> => {
  const params = status ? { status } : {};
  const response = await axios.get<Package[]>(API_URL, { params });
  return response.data;
};

export const getPackageById = async (id: number): Promise<Package> => {
  const response = await axios.get<Package>(`${API_URL}/${id}`);
  return response.data;
};

export const createPackage = async (data: CreatePackageRequest): Promise<Package> => {
  const response = await axios.post<Package>(API_URL, data);
  return response.data;
};

export const updatePackageStatus = async (id: number, data: UpdateStatusRequest): Promise<Package> => {
  const response = await axios.put<Package>(`${API_URL}/${id}/status`, data);
  return response.data;
};

export const getValidStatusTransitions = async (id: number): Promise<PackageStatus[]> => {
  const response = await axios.get<PackageStatus[]>(`${API_URL}/${id}/valid-transitions`);
  return response.data;
};

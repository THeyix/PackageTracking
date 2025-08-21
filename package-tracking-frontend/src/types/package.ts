export enum PackageStatus {
  Created = 1,
  Sent = 2,
  Accepted = 3,
  Returned = 4,
  Canceled = 5,
}

export interface StatusHistory {
  id: number;
  status: PackageStatus;
  timestamp: string;
}

export interface Package {
  id: number;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  currentStatus: PackageStatus;
  createdAt: string;
  statusHistory: StatusHistory[];
}

export interface CreatePackageRequest {
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
}

export interface UpdateStatusRequest {
  newStatus: PackageStatus;
}

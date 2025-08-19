export const PACKAGE_STATUS = {
  CREATED: 0,
  SENT: 1,
  ACCEPTED: 2,
  RETURNED: 3,
  CANCELED: 4
};

export const STATUS_NAMES = {
  [PACKAGE_STATUS.CREATED]: 'Created',
  [PACKAGE_STATUS.SENT]: 'Sent',
  [PACKAGE_STATUS.ACCEPTED]: 'Accepted',
  [PACKAGE_STATUS.RETURNED]: 'Returned',
  [PACKAGE_STATUS.CANCELED]: 'Canceled'
};

export const STATUS_COLORS = {
  [PACKAGE_STATUS.CREATED]: 'bg-gray-100 text-gray-800',
  [PACKAGE_STATUS.SENT]: 'bg-blue-100 text-blue-800',
  [PACKAGE_STATUS.ACCEPTED]: 'bg-green-100 text-green-800',
  [PACKAGE_STATUS.RETURNED]: 'bg-yellow-100 text-yellow-800',
  [PACKAGE_STATUS.CANCELED]: 'bg-red-100 text-red-800'
};

export const getAvailableTransitions = (currentStatus) => {
  switch (currentStatus) {
    case PACKAGE_STATUS.CREATED:
      return [PACKAGE_STATUS.SENT, PACKAGE_STATUS.CANCELED];
    case PACKAGE_STATUS.SENT:
      return [PACKAGE_STATUS.ACCEPTED, PACKAGE_STATUS.RETURNED, PACKAGE_STATUS.CANCELED];
    case PACKAGE_STATUS.RETURNED:
      return [PACKAGE_STATUS.SENT, PACKAGE_STATUS.CANCELED];
    case PACKAGE_STATUS.ACCEPTED:
    case PACKAGE_STATUS.CANCELED:
      return []; // Final states
    default:
      return [];
  }
};

import React, { useState } from 'react';
import { CreatePackageRequest } from '../types/package';
import * as packageService from '../services/packageService';

interface CreatePackageProps {
  onClose: () => void;
  onPackageCreated: () => void;
}

const CreatePackage: React.FC<CreatePackageProps> = ({ onClose, onPackageCreated }) => {
  const [formData, setFormData] = useState<CreatePackageRequest>({
    senderName: '',
    senderAddress: '',
    senderPhone: '',
    recipientName: '',
    recipientAddress: '',
    recipientPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await packageService.createPackage(formData);
      onPackageCreated();
      onClose();
    } catch (err) {
      setError('Failed to create package. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h2 className="text-2xl font-bold mb-4">Create New Package</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
            {}
            {}
             <div>
                <h3 className="text-lg font-semibold">Sender Information</h3>
                <input name="senderName" value={formData.senderName} onChange={handleChange} placeholder="Sender Name" required className="w-full border p-2 rounded mt-2" />
                <input name="senderAddress" value={formData.senderAddress} onChange={handleChange} placeholder="Sender Address" required className="w-full border p-2 rounded mt-2" />
                <input name="senderPhone" value={formData.senderPhone} onChange={handleChange} placeholder="Sender Phone" required className="w-full border p-2 rounded mt-2" />
             </div>
             <div>
                <h3 className="text-lg font-semibold">Recipient Information</h3>
                <input name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="Recipient Name" required className="w-full border p-2 rounded mt-2" />
                <input name="recipientAddress" value={formData.recipientAddress} onChange={handleChange} placeholder="Recipient Address" required className="w-full border p-2 rounded mt-2" />
                <input name="recipientPhone" value={formData.recipientPhone} onChange={handleChange} placeholder="Recipient Phone" required className="w-full border p-2 rounded mt-2" />
             </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400">
              {loading ? 'Creating...' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePackage;

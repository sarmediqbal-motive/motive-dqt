
import React, { useState } from 'react';
import type { Company } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface CompanyInputFormProps {
  onAddCompany: (company: Omit<Company, 'id'>) => void;
}

export const CompanyInputForm: React.FC<CompanyInputFormProps> = ({ onAddCompany }) => {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({ name: '', location: '' });

  const validateForm = () => {
    const newErrors = { name: '', location: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Company name is required.';
      isValid = false;
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddCompany({ name, website, location });
      setName('');
      setWebsite('');
      setLocation('');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company-name"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g., Innovatech Inc."
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            aria-invalid={!!errors.name}
            aria-describedby="company-name-error"
          />
          {errors.name && <p id="company-name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="company-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            State + Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company-location"
            value={location}
            onChange={handleLocationChange}
            placeholder="e.g., California, USA"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            aria-invalid={!!errors.location}
            aria-describedby="company-location-error"
          />
          {errors.location && <p id="company-location-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Website (Optional)
        </label>
        <input
          type="url"
          id="company-website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="e.g., https://innovatech.com"
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="text-right">
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
          Add Company
        </button>
      </div>
    </form>
  );
};

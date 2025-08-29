
import React, { useState, useRef } from 'react';
import type { Company } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface BulkUploadFormProps {
  onAddCompanies: (companies: Omit<Company, 'id'>[]) => void;
}

// Simple CSV parser
const parseCSV = (csvText: string): Omit<Company, 'id'>[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  // Assuming header: name,website,location
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const nameIndex = header.indexOf('name');
  const websiteIndex = header.indexOf('website');
  const locationIndex = header.indexOf('location');

  if (nameIndex === -1 || locationIndex === -1) {
    throw new Error('CSV must contain "name" and "location" columns.');
  }

  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      name: values[nameIndex]?.trim() || '',
      website: values[websiteIndex]?.trim() || '',
      location: values[locationIndex]?.trim() || ''
    };
  }).filter(c => c.name && c.location); // Ensure required fields are present
};

export const BulkUploadForm: React.FC<BulkUploadFormProps> = ({ onAddCompanies }) => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const companies = parseCSV(text);
        if (companies.length === 0) {
          setError("No valid companies found in the file. Please check the format.");
          return;
        }
        onAddCompanies(companies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV file.');
      }
    };

    reader.onerror = () => {
      setError('Failed to read the file.');
    };

    reader.readAsText(file);
    
    // Reset file input to allow uploading the same file again
    e.target.value = '';
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="space-y-4 text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="inline-flex items-center justify-center px-6 py-3 border border-dashed border-gray-400 dark:border-gray-500 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <UploadIcon className="w-6 h-6 mr-3" />
        {fileName || 'Upload CSV File'}
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        CSV format: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">name,website,location</code> (header row required).
      </p>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

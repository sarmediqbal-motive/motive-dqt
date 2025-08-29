
import React from 'react';
import type { Company } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { GlobeAltIcon } from './icons/GlobeAltIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface CompanyListProps {
  companies: Company[];
  onRemoveCompany: (id: string) => void;
}

export const CompanyList: React.FC<CompanyListProps> = ({ companies, onRemoveCompany }) => {
  if (companies.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Analysis Queue ({companies.length})</h3>
      <div className="max-h-60 overflow-y-auto pr-2">
        <ul className="space-y-3">
          {companies.map((company) => (
            <li
              key={company.id}
              className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between shadow-sm border border-gray-200 dark:border-gray-600"
            >
              <div className="flex-1 min-w-0">
                  <p className="text-md font-semibold text-blue-600 dark:text-blue-400 truncate">{company.name}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 space-x-4">
                      <span className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1.5" />
                          {company.location}
                      </span>
                      {company.website && (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-500 truncate">
                              <GlobeAltIcon className="w-4 h-4 mr-1.5" />
                              <span className="truncate">{company.website}</span>
                          </a>
                      )}
                  </div>
              </div>
              <button
                onClick={() => onRemoveCompany(company.id)}
                className="ml-4 p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Remove ${company.name}`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

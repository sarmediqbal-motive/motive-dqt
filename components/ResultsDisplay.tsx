
import React from 'react';
import type { AnalysisResult, GroundingChunk } from '../types';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { LinkIcon } from './icons/LinkIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ResultsDisplayProps {
  results: AnalysisResult[];
  groundingChunks: GroundingChunk[];
  onClearResults: () => void;
}

const StatusBadge: React.FC<{ status: AnalysisResult['status'] }> = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  if (status === 'Active') {
    return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>Active</span>;
  }
  if (status === 'Inactive') {
    return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`}>Inactive</span>;
  }
  return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>Unknown</span>;
};

const ConfidenceBadge: React.FC<{ level: AnalysisResult['confidenceLevel'] }> = ({ level }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block";
  if (level === 'High') {
    return <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>High</span>;
  }
  if (level === 'Medium') {
    return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>Medium</span>;
  }
  if (level === 'Low') {
    return <span className={`${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`}>Low</span>;
  }
  return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>Unknown</span>;
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, groundingChunks, onClearResults }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Analysis Complete
        </h2>
        <p className="mt-2 text-md text-gray-500 dark:text-gray-400">
          No results were generated from the analysis.
        </p>
      </div>
    );
  }

  const renderLinks = (linksString: string) => {
    if (!linksString) return 'N/A';
    return linksString.split(',').map(link => link.trim()).filter(link => link).map((link, index) => (
      <a
        key={index}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mr-2 break-all"
      >
        <ExternalLinkIcon className="w-3 h-3 mr-1" />
        Link {index + 1}
      </a>
    ));
  };

  const escapeCSVCell = (cellData: string) => {
    // Return an empty string if cellData is null or undefined
    if (cellData == null) {
      return '';
    }
    const stringCellData = String(cellData);
    if (stringCellData.includes(',') || stringCellData.includes('"') || stringCellData.includes('\n')) {
      const escapedData = stringCellData.replace(/"/g, '""');
      return `"${escapedData}"`;
    }
    return stringCellData;
  };
  
  const handleExportCSV = () => {
    const headers = [
      'Company Name',
      'Status',
      'Confidence Level',
      'Brief Summary',
      'Supporting Links'
    ];
    
    const rows = results.map(result => [
      escapeCSVCell(result.companyName),
      escapeCSVCell(result.status),
      escapeCSVCell(result.confidenceLevel),
      escapeCSVCell(result.summary),
      escapeCSVCell(result.links)
    ].join(','));
  
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'analysis_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Analysis Results <span className="font-normal text-gray-500 dark:text-gray-400">({results.length})</span>
        </h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 whitespace-nowrap"
            aria-label="Export results to CSV"
          >
            <DownloadIcon className="w-5 h-5 mr-2 -ml-1" />
            Export to CSV
          </button>
          <button
            onClick={onClearResults}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
            aria-label="Clear all results"
          >
            <TrashIcon className="w-5 h-5 mr-2 -ml-1" />
            Clear Results
          </button>
        </div>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Confidence</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Summary</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Supporting Links</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{result.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"><StatusBadge status={result.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"><ConfidenceBadge level={result.confidenceLevel} /></td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs">{result.summary}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-sm">{renderLinks(result.links)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {groundingChunks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2" />
            Research Sources
          </h3>
          <ul className="list-disc list-inside space-y-2 pl-2">
            {groundingChunks.map((chunk, index) => (
              <li key={index}>
                <a 
                  href={chunk.web.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {chunk.web.title || chunk.web.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

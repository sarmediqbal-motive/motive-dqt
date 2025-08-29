import React, { useState, useCallback } from 'react';
import { CompanyInputForm } from './components/CompanyInputForm';
import { BulkUploadForm } from './components/BulkUploadForm'; // New import
import { CompanyList } from './components/CompanyList';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { analyzeCompanyStatus } from './services/geminiService';
import type { Company, AnalysisResult, GroundingChunk } from './types';
import { BotIcon } from './components/icons/BotIcon';

const BATCH_SIZE = 10;
type InputMode = 'single' | 'bulk';

const App: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [analysisCompleted, setAnalysisCompleted] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<InputMode>('single');

  const addCompany = (company: Omit<Company, 'id'>) => {
    setCompanies(prev => [...prev, { ...company, id: Date.now().toString() + Math.random() }]);
  };

  const addCompanies = (newCompanies: Omit<Company, 'id'>[]) => {
    const companiesWithIds = newCompanies.map((c, i) => ({ ...c, id: `${Date.now()}-${i}` }));
    setCompanies(prev => [...prev, ...companiesWithIds]);
  };

  const removeCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const clearResults = () => {
    setResults([]);
    setGroundingChunks([]);
    setAnalysisCompleted(false);
  };

  const handleAnalyze = useCallback(async () => {
    if (companies.length === 0) {
      setError("Please add at least one company to analyze.");
      return;
    }

    setAnalysisCompleted(false);
    setIsLoading(true);
    setError(null);
    setResults([]);
    setGroundingChunks([]);
    setProgressMessage('Preparing for analysis...');

    const companyBatches: Company[][] = [];
    for (let i = 0; i < companies.length; i += BATCH_SIZE) {
        companyBatches.push(companies.slice(i, i + BATCH_SIZE));
    }

    const allResults: AnalysisResult[] = [];
    const allGroundingChunks: GroundingChunk[] = [];

    for (let i = 0; i < companyBatches.length; i++) {
      const batch = companyBatches[i];
      const progressText = `Analyzing batch ${i + 1} of ${companyBatches.length} (${i * BATCH_SIZE + 1}-${Math.min((i + 1) * BATCH_SIZE, companies.length)} of ${companies.length})`;
      setProgressMessage(progressText);
      
      try {
        const { results: batchResults, groundingChunks: batchGroundingChunks } = await analyzeCompanyStatus(batch);
        
        allResults.push(...batchResults);
        allGroundingChunks.push(...batchGroundingChunks);
        
        // Update results progressively
        setResults([...allResults]);
        setGroundingChunks([...allGroundingChunks]);

        // Add delay if it's not the last batch to avoid rate limiting
        if (i < companyBatches.length - 1) {
          setProgressMessage(`Batch ${i + 1} complete. Waiting 5 seconds to avoid rate limits...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Analysis failed on batch ${i + 1}. Error: ${errorMessage}`);
        setIsLoading(false);
        setProgressMessage('');
        setAnalysisCompleted(true);
        return; // Stop on error
      }
    }

    setCompanies([]); // Clear the list after successful analysis
    setIsLoading(false);
    setProgressMessage('');
    setAnalysisCompleted(true);
  }, [companies]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-4">
            <BotIcon className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              AI Business Intelligence Analyst
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Automate company operational status research. Add company details below and let the AI agent conduct a comprehensive analysis using the latest public information.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">1. Add Companies for Analysis</h2>
            
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button
                        onClick={() => setInputMode('single')}
                        className={`${
                            inputMode === 'single'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                    >
                        Add Single Company
                    </button>
                    <button
                        onClick={() => setInputMode('bulk')}
                        className={`${
                            inputMode === 'bulk'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                    >
                        Bulk Upload (.csv)
                    </button>
                </nav>
            </div>

            {inputMode === 'single' ? (
              <CompanyInputForm onAddCompany={addCompany} />
            ) : (
              <BulkUploadForm onAddCompanies={addCompanies} />
            )}
            
            <CompanyList companies={companies} onRemoveCompany={removeCompany} />
            
            {companies.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {isLoading ? 'Analyzing...' : `Analyze ${companies.length} ${companies.length > 1 ? 'Companies' : 'Company'}`}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && <Loader message={progressMessage} />}

          {analysisCompleted && !isLoading && (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <ResultsDisplay results={results} groundingChunks={groundingChunks} onClearResults={clearResults} />
            </div>
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
        Powered by Gemini API
      </footer>
    </div>
  );
};

export default App;
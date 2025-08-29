
import React from 'react';
import { BotIcon } from './icons/BotIcon';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 my-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <BotIcon className="w-12 h-12 text-blue-500 animate-bounce" />
    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
      {message || 'AI Analyst is at work...'}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">Conducting research and compiling results.</p>
  </div>
);

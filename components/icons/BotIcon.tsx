
import React from 'react';

export const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 18c2.21 0 4-1.79 4-4H8c0 2.21 1.79 4 4 4z" />
    <circle cx="15.5" cy="10.5" r="1.5" />
    <circle cx="8.5" cy="10.5" r="1.5" />
  </svg>
);

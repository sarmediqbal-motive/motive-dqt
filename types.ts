
export interface Company {
  id: string;
  name: string;
  website: string;
  location: string;
}

export interface AnalysisResult {
  companyName: string;
  status: 'Active' | 'Inactive' | 'Unknown';
  confidenceLevel: 'High' | 'Medium' | 'Low' | 'Unknown';
  summary: string;
  links: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  }
}

export type GeminiApiResponse = {
  results: AnalysisResult[];
  groundingChunks: GroundingChunk[];
};

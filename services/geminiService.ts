import { GoogleGenAI } from "@google/genai";
import type { Company, AnalysisResult, GeminiApiResponse, GroundingChunk } from '../types';
import { SYSTEM_PROMPT } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseMarkdownTable = (markdown: string): AnalysisResult[] => {
  if (!markdown || typeof markdown !== 'string') {
    return [];
  }
  
  const rows = markdown.trim().split('\n').slice(2); // Skip header and separator
  return rows.map(row => {
    const columns = row.split('|').map(cell => cell.trim());
    // Expecting format: | Company Name | Status | Confidence Level | Summary | Links |
    if (columns.length < 6) {
      return null;
    }
    return {
      companyName: columns[1] || 'N/A',
      status: (columns[2] as AnalysisResult['status']) || 'Unknown',
      confidenceLevel: (columns[3] as AnalysisResult['confidenceLevel']) || 'Unknown',
      summary: columns[4] || 'N/A',
      links: columns[5] || '',
    };
  }).filter((result): result is AnalysisResult => result !== null);
};

export const analyzeCompanyStatus = async (companies: Company[]): Promise<GeminiApiResponse> => {
  const companyInfo = companies.map(c => `- ${c.name} (${c.location}, Website: ${c.website || 'N/A'})`).join('\n');
  const userPrompt = `Please analyze the following companies:\n${companyInfo}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [{ text: userPrompt }] },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
      },
    });

    const markdownTable = response.text;
    const results = parseMarkdownTable(markdownTable);
    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || []);

    if (results.length === 0 && markdownTable) {
        console.warn("Markdown parsing resulted in empty array. Raw response:", markdownTable);
        throw new Error("Failed to parse the analysis results from the AI. The format may be incorrect.");
    }
    
    return { results, groundingChunks };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`An error occurred while communicating with the AI: ${errorMessage}`);
  }
};
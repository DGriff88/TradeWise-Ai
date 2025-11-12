
import React, { useState, useCallback } from 'react';
import { getMarketSignal } from '../services/geminiService';
import Card from './shared/Card';
import Button from './shared/Button';
import Loader from './shared/Loader';

const MarketSignal: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('What is the market sentiment for tech stocks this week?');
  const [result, setResult] = useState<string>('');
  const [sources, setSources] = useState<{ web: { uri: string; title: string } }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateSignal = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');
    setSources([]);

    try {
      const response = await getMarketSignal(prompt);
      setResult(response.text);
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webSources = groundingChunks
        .filter(chunk => chunk.web && chunk.web.uri) as { web: { uri: string; title: string } }[];
      setSources(webSources);

    } catch (err) {
      setError('An error occurred while fetching the market signal. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>Get Real-Time Market Signals</Card.Header>
        <Card.Body>
          <p className="text-[#8B949E] mb-4">Enter a query about a stock, sector, or the general market to get an AI-powered signal grounded in the latest Google Search data.</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Should I buy Tesla stock now?"
            className="w-full h-24 p-3 bg-[#0D1117] border border-[#30363D] rounded-md focus:ring-2 focus:ring-[#25D366] focus:outline-none transition text-[#E6EDF3]"
            disabled={isLoading}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={handleGenerateSignal} disabled={isLoading}>
              {isLoading ? <Loader size="sm" /> : 'Generate Signal'}
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {error && <p className="text-red-400 text-center">{error}</p>}

      {isLoading && (
        <Card>
          <Card.Body>
            <div className="flex flex-col items-center justify-center p-8">
              <Loader />
              <p className="mt-4 text-[#8B949E]">Analyzing market data...</p>
            </div>
          </Card.Body>
        </Card>
      )}

      {result && (
        <Card>
          <Card.Header>AI Analysis</Card.Header>
          <Card.Body>
            <div className="prose prose-invert prose-sm max-w-none text-[#E6EDF3] whitespace-pre-wrap">{result}</div>
            {sources.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-white mb-2">Sources:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {sources.map((source, index) => (
                    <li key={index}>
                      <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline text-sm">
                        {source.web.title || source.web.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MarketSignal;

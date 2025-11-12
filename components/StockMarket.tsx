import React, { useState, useEffect, useCallback } from 'react';
import { fetchStockQuote } from '../services/alphaVantageService';
import { StockQuote } from '../types';
import Card from './shared/Card';
import Loader from './shared/Loader';
import Button from './shared/Button';
import Modal from './shared/Modal';
import StockChart from './StockChart';
import { TrendingUpIcon, TrendingDownIcon, RefreshIcon } from './shared/Icons';

const stocksToTrack = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
];

const StockMarket: React.FC = () => {
  const [stockData, setStockData] = useState<StockQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);

  const fetchAllQuotes = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    const fetchedQuotes: StockQuote[] = [];
    try {
      // Stagger API calls to avoid rate limiting on the demo key
      const quotePromises = stocksToTrack.map((stock, index) =>
        new Promise<StockQuote | null>(resolve => 
          setTimeout(async () => {
            const quote = await fetchStockQuote(stock.symbol);
            resolve(quote ? { ...quote, name: stock.name } : null);
          }, index * 1200) // 1.2 second delay between calls
        )
      );
      const results = await Promise.all(quotePromises);
      setStockData(results.filter((q): q is StockQuote => q !== null));

    } catch (e) {
      console.error(e);
      setError('Failed to load market data. The API limit may have been reached. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllQuotes();
  }, [fetchAllQuotes]);

  if (isLoading && stockData.length === 0) {
    return (
      <Card>
        <Card.Body>
          <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
            <Loader />
            <p className="mt-4 text-[#8B949E]">Fetching Live Market Data...</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-end">
            <Button onClick={fetchAllQuotes} disabled={isLoading} variant="ghost" size="sm">
                {isLoading ? <Loader size="sm" /> : <RefreshIcon className="h-4 w-4 mr-2" />}
                Refresh Data
            </Button>
        </div>

      {error && (
        <Card>
            <Card.Body className="text-center text-red-400">{error}</Card.Body>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stockData.map((stock) => {
          const isPositive = parseFloat(stock.change) >= 0;
          return (
            <Card 
                key={stock.symbol} 
                onClick={() => setSelectedStock(stock)}
                className="cursor-pointer hover:bg-[#30363D]/40 hover:border-[#424a53] transition-all duration-300"
            >
              <Card.Body>
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="text-2xl font-bold text-white">{stock.symbol}</h4>
                        <p className="text-sm text-[#8B949E] truncate">{stock.name}</p>
                    </div>
                    {isPositive ? <TrendingUpIcon className="h-8 w-8 text-green-500" /> : <TrendingDownIcon className="h-8 w-8 text-red-500" />}
                </div>
                <div className="mt-4 text-right">
                    <p className="text-3xl font-semibold text-white">${stock.price}</p>
                    <p className={`text-lg font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{stock.change} ({isPositive ? '+' : ''}{stock.changePercent}%)
                    </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#30363D]">
                    <p className="text-sm text-[#8B949E]">Volume: <span className="font-medium text-white">{stock.volume}</span></p>
                </div>
              </Card.Body>
            </Card>
          );
        })}
         {isLoading && stockData.length > 0 && <p className="text-center text-[#8B949E] col-span-full">Refreshing data...</p>}
      </div>
      
      {selectedStock && (
        <Modal
            isOpen={!!selectedStock}
            onClose={() => setSelectedStock(null)}
            title={`${selectedStock.name} (${selectedStock.symbol}) - Historical Price`}
        >
            <StockChart symbol={selectedStock.symbol} />
        </Modal>
      )}
    </div>
  );
};

export default StockMarket;

import { StockQuote, TimeSeriesDataPoint } from '../types';

// In a real application, this should come from a secure backend or environment variables.
// Using the 'demo' key for demonstration purposes as per Alpha Vantage documentation.
const ALPHA_VANTAGE_API_KEY = 'demo';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// A simple in-memory cache to avoid re-fetching data on fast navigations
const quoteCache = new Map<string, { data: StockQuote, timestamp: number }>();
const timeSeriesCache = new Map<string, { data: TimeSeriesDataPoint[], timestamp: number }>();
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const fetchStockQuote = async (symbol: string): Promise<StockQuote | null> => {
  const cached = quoteCache.get(symbol);
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
    return cached.data;
  }

  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Handle API rate limit message gracefully for the main dashboard
    if (data['Information']) {
      console.warn(`Alpha Vantage API Note for ${symbol} (quote): ${data['Information']}`);
      return null;
    }

    const quote = data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      // This can happen if the API limit is reached or the symbol is invalid.
      console.warn(`No quote data for symbol ${symbol}.`);
      return null;
    }
    
    const normalizedQuote: StockQuote = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']).toFixed(2),
      change: parseFloat(quote['09. change']).toFixed(2),
      changePercent: quote['10. change percent'].slice(0, -1), // remove trailing '%'
      volume: parseInt(quote['06. volume'], 10).toLocaleString(),
    };
    
    quoteCache.set(symbol, { data: normalizedQuote, timestamp: Date.now() });

    return normalizedQuote;
  } catch (error) {
    console.error(`Failed to fetch stock quote for ${symbol}:`, error);
    // Invalidate cache on error
    quoteCache.delete(symbol);
    throw error; // Re-throw to be handled by the component
  }
};

export const fetchTimeSeriesDaily = async (symbol: string): Promise<TimeSeriesDataPoint[]> => {
    const cached = timeSeriesCache.get(symbol);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
        return cached.data;
    }

    try {
        const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Handle API rate limit message explicitly for the chart view
        if (data['Information']) {
            console.warn(`Alpha Vantage API Note for ${symbol} (time series): ${data['Information']}`);
            throw new Error('API rate limit reached. Please wait a minute and try again.');
        }

        const timeSeries = data['Time Series (Daily)'];
        if (!timeSeries) {
            console.warn(`No time series data for symbol ${symbol}.`);
            throw new Error('No time series data returned from API. This could be due to API rate limits or an invalid symbol.');
        }

        const normalizedData: TimeSeriesDataPoint[] = Object.entries(timeSeries)
            .map(([date, values]: [string, any]) => ({
                date,
                close: parseFloat(values['4. close']),
            }))
            .reverse(); // reverse to have chronological order for the chart

        timeSeriesCache.set(symbol, { data: normalizedData, timestamp: Date.now() });
        return normalizedData;

    } catch (error) {
        console.error(`Failed to fetch time series for ${symbol}:`, error);
        timeSeriesCache.delete(symbol);
        throw error;
    }
};
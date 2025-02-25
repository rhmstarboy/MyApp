import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { WebSocketServer, WebSocket } from 'ws';
import axios from 'axios';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
}

interface CacheData {
  data: MarketData[] | null;
  timestamp: number;
  retryCount: number;
}

// Cache market data to avoid rate limits
let marketDataCache: CacheData = {
  data: null,
  timestamp: 0,
  retryCount: 0
};

const CACHE_DURATION = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  await setupAuth(app);

  // Proxy endpoint for crypto market data
  app.get('/api/market/ticker', async (req, res) => {
    try {
      const now = Date.now();

      // Return cached data if it's fresh
      if (marketDataCache.data && (now - marketDataCache.timestamp) < CACHE_DURATION) {
        return res.json(marketDataCache.data);
      }

      // Make request to CoinGecko with retry logic
      const response = await fetchWithRetry();
      const transformedData = transformCoinGeckoData(response.data);

      // Update cache
      marketDataCache = {
        data: transformedData,
        timestamp: now,
        retryCount: 0
      };

      res.json(transformedData);
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Return cached data if available, even if stale
      if (marketDataCache.data) {
        return res.json(marketDataCache.data);
      }
      res.status(500).json({ message: 'Failed to fetch market data' });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    let updateInterval: NodeJS.Timeout;

    const sendMarketUpdate = async () => {
      try {
        // Use the same retry logic as the HTTP endpoint
        const response = await fetchWithRetry();
        const transformedData = transformCoinGeckoData(response.data);

        // Update cache
        marketDataCache = {
          data: transformedData,
          timestamp: Date.now(),
          retryCount: 0
        };

        // Only send if connection is still open
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'market_update',
            data: transformedData
          }));
        }
      } catch (error) {
        console.error('Error in WebSocket update:', error);
        // Send cached data if available
        if (marketDataCache.data && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'market_update',
            data: marketDataCache.data
          }));
        }
      }
    };

    // Send initial data
    if (marketDataCache.data && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'market_update',
        data: marketDataCache.data
      }));
    }

    // Set up periodic updates
    updateInterval = setInterval(sendMarketUpdate, 30000);

    ws.on('error', console.error);

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clearInterval(updateInterval);
    });
  });

  return httpServer;
}

// Helper functions
async function fetchWithRetry(retryCount = 0): Promise<any> {
  try {
    return await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum,solana',
        vs_currencies: 'usd',
        include_24hr_change: true
      },
      timeout: 5000
    });
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)));
      return fetchWithRetry(retryCount + 1);
    }
    throw error;
  }
}

function transformCoinGeckoData(data: any): MarketData[] {
  return Object.entries(data).map(([id, data]: [string, any]) => ({
    symbol: id.toUpperCase(),
    price: data.usd,
    change: data.usd_24h_change || 0
  }));
}
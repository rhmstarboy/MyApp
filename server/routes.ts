import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { WebSocketServer } from 'ws';
import axios from 'axios';

// Cache market data to avoid rate limits
let marketDataCache = {
  data: null,
  timestamp: 0
};

const CACHE_DURATION = 10000; // 10 seconds

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

      // Fetch new data from CoinGecko
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin,ethereum,solana',
            vs_currencies: 'usd',
            include_24hr_change: true
          }
        }
      );

      // Transform data to match our expected format
      const transformedData = Object.entries(response.data).map(([id, data]: [string, any]) => ({
        symbol: id.toUpperCase(),
        price: data.usd,
        change: data.usd_24h_change || 0
      }));

      // Update cache
      marketDataCache = {
        data: transformedData,
        timestamp: now
      };

      res.json(transformedData);
    } catch (error) {
      console.error('Error fetching market data:', error);
      res.status(500).json({ message: 'Failed to fetch market data' });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Set up WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    // Send initial market data
    if (marketDataCache.data) {
      ws.send(JSON.stringify({
        type: 'market_update',
        data: marketDataCache.data
      }));
    }

    // Set up periodic updates
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price',
          {
            params: {
              ids: 'bitcoin,ethereum,solana',
              vs_currencies: 'usd',
              include_24hr_change: true
            }
          }
        );

        const transformedData = Object.entries(response.data).map(([id, data]: [string, any]) => ({
          symbol: id.toUpperCase(),
          price: data.usd,
          change: data.usd_24h_change || 0
        }));

        ws.send(JSON.stringify({
          type: 'market_update',
          data: transformedData
        }));
      } catch (error) {
        console.error('Error fetching market data for WebSocket:', error);
      }
    }, 10000); // Update every 10 seconds

    ws.on('error', console.error);

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clearInterval(interval);
    });
  });

  return httpServer;
}
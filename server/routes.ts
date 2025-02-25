import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { WebSocketServer } from 'ws';
import axios from 'axios';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  await setupAuth(app);

  // Proxy endpoint for Binance API
  app.get('/api/binance/ticker24hr', async (req, res) => {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching Binance data:', error);
      res.status(500).json({ message: 'Failed to fetch market data' });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Set up WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('error', console.error);

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
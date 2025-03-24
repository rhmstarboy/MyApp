import { WebSocketServer } from "ws";
import { Server } from "http";

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');

    // Send initial market data
    const initialData = {
      type: 'market_data',
      data: {
        BTC: { price: 65000, change: 2.5 },
        ETH: { price: 3500, change: 1.8 },
        BNB: { price: 450, change: -0.5 }
      }
    };
    ws.send(JSON.stringify(initialData));

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received:', data);
        
        // Echo back the message for testing
        ws.send(JSON.stringify({
          type: 'echo',
          data: data
        }));
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Broadcast market updates periodically
  setInterval(() => {
    if (wss.clients.size > 0) {
      const marketUpdate = {
        type: 'market_update',
        data: {
          BTC: { price: 65000 + Math.random() * 1000, change: (Math.random() * 5) - 2.5 },
          ETH: { price: 3500 + Math.random() * 200, change: (Math.random() * 4) - 2 },
          BNB: { price: 450 + Math.random() * 50, change: (Math.random() * 3) - 1.5 }
        }
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(marketUpdate));
        }
      });
    }
  }, 5000);
}

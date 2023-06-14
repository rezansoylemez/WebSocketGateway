const WebSocket = require('ws');
const http = require('http');
const url = require('url');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

const gatewayMap = { 
  '/Delete': { host: 'localhost', port: 5010, path: '/api/Hero/Delete' },

  '/Update': { host: 'localhost', port: 5010, path: '/api/Hero/Update' }, 
  
  '/ChangeStatusHero': { host: 'localhost', port: 5010, path: '/api/Hero/ChangeStatusHero' },
};

// Map of URL paths to external gateways

// Handle incoming WebSocket connections
wss.on('connection', (ws) => {
  // Handle incoming messages from clients
  ws.on('message', (message) => {
    try {
      const { url, params } = JSON.parse(message);

      // Find the external gateway for the given URL
      const gateway = gatewayMap[url];
      if (!gateway) {
        ws.send(JSON.stringify({ error: 'Gateway not found' }));
        return;
      }

      // Construct the request path
      const requestPath = `${gateway.path}`;

      // Prepare the HTTP request options
      const requestOptions = {
        host: gateway.host,
        port: gateway.port,
        method: 'PUT',
        path: requestPath,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Create an HTTP request to the external gateway
      const httpRequest = http.request(requestOptions, (httpResponse) => {
        let responseData = '';

        // Receive the response from the external gateway
        httpResponse.on('data', (chunk) => {
          responseData += chunk;
        });

        // Handle the end of the response
        httpResponse.on('end', () => {
          // Send the response back to the client
          ws.send(responseData);
        });
      });

      // Handle errors in the HTTP request
      httpRequest.on('error', (error) => {
        ws.send(JSON.stringify({ error: 'Gateway request error' }));
      });

      // Send the HTTP request body
      httpRequest.write(JSON.stringify(params));

      // Send the HTTP request
      httpRequest.end();
    } catch (error) {
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  // Handle WebSocket connection close
  ws.on('close', () => {
    // Cleanup code, if needed
  });
});

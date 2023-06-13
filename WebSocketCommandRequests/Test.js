const WebSocket = require('ws');
const http = require('http');
const url = require('url');

 

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

 

// Map of URLs to external gateways
const gatewayMap = { 
    '/Create': { host: 'localhost', port: 5010, path: '/api/HeroStat/Create' } 
};

 

// Handle incoming WebSocket connections
wss.on('connection', (ws) => {
  // Handle incoming messages from clients
  ws.on('message', (message) => {
    try {
      const { url, method, paths, params, body } = JSON.parse(message);

 

      // Find the external gateways for the given URL
      const gateways = gatewayMap[url];
      if (!gateways) {
        ws.send(JSON.stringify({ error: 'Gateway not found' }));
        return;
      }

 

      // Select a random gateway from the available options
      const randomGateway = gateways[Math.floor(Math.random() * gateways.length)];

 

      // Find the path object based on the provided path name
      const selectedPath = paths.find((path) => path === randomGateway.path);
      if (!selectedPath) {
        ws.send(JSON.stringify({ error: 'Path not found' }));
        return;
      }

 

      // Construct the request path
      const requestPath = `${selectedPath}?${formatParams(params)}`;

 

      // Prepare the HTTP request options
      const requestOptions = {
        host: randomGateway.host,
        port: randomGateway.port,
        method: method.toUpperCase(),
        path: requestPath,
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

 

      // Send the request body, if provided
      if (body) {
        httpRequest.write(JSON.stringify(body));
      }

 

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

 

// Format query parameters as a string
function formatParams(params) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}
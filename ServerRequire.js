// Create a WebSocket server

const wss = new WebSocket.Server({ port: 8080 });


// Map of URL paths to external gateways

const gatewayMap = {

  '/gateway1': { host: '192.168.1.56', port: 5010 },

  //'/gateway2': { host: 'external-gateway2.example.com', port: 4000 },

  // Add more paths and corresponding gateways as needed

};
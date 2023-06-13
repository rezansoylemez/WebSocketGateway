const WebSocket = require('ws');

const http = require('http');

const url = require('url');

 

// Create a WebSocket server

const wss = new WebSocket.Server({ port: 8080 });

 

// Map of URL paths to external gateways

const gatewayMap = {

  '/get_list_by_hero_type': { host: 'localhost', port: 5010 },

  //'/get_list_by_hero_type': { host: 'external-gateway2.example.com', port: 4000 },

  // Add more paths and corresponding gateways as needed

};

 

// Handle incoming WebSocket connections

wss.on('connection', (ws) => {

  // Handle incoming messages from clients

  ws.on('message', (message) => {

    try {

      const { url, params,data } = JSON.parse(message);

 

      // Find the external gateway for the given URL

      const gateway = gatewayMap[url];

      if (!gateway) {

        ws.send(JSON.stringify({ error: 'Gateway not found' }));

        return;

      }

 

      // Prepare the HTTP request options

      const requestOptions = {

        host: gateway.host,

        port: gateway.port,

        method: 'GET',

        path: `/api/Hero/GetListByHeroType${formatParams1(params.heroType)}${formatParams2(params.page)}${formatParams3(params.pageSize)}`,

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

function formatParams1(params) {

  if (!params) return '';

 

  const formattedParams = Object.entries(params)

    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)

    .join('&');

 

  return `?${formattedParams}`;

}

function formatParams2(page) {

  if (!page) return '';

 

  const formattedParams = Object.entries(page)

    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)

    .join('&');

 

  return `?${formattedParams}`;

}
function formatParams3(pageSize) {

  if (!pageSize) return '';

 

  const formattedParams = Object.entries(pageSize)

    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)

    .join('&');

 

  return `?${formattedParams}`;

}




function pageRequestFormatParams(params) {

  if (!params) return '';

  const formattedParams = Object.entries(params)

    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`) = 0
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`) =10
    
    .join('&');
  return `?${formattedParams}`;
}
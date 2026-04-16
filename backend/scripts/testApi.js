const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/products',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const products = JSON.parse(data);
      console.log('Fetched Products Count:', products.length);
      if (products.length > 0) {
        console.log('First Product Title:', products[0].title);
      }
    } catch (e) {
      console.log('Error parsing JSON:', e.message);
      console.log('Raw Data:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();

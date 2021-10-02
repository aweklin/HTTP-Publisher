// dependecy imports
const http = require('http');
const app = require('./app');

// setup server
const port = process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(port);/*, () => { 
    console.log(`Publisher server is running on port ${port}...`) 
});*/
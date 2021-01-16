const express = require('express');
const app = express();
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./TeamLithium.yaml');
//const swaggerDocument = require('./swagger.json'//////////////////

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

console.log('Starting API documnetation on localhost 3002')

app.listen(3002);

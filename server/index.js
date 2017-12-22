require('./awsSetup.js');
const express = require('express');
const parser = require('body-parser');
const client = require('../database/index.js');
const calculate = require('./calculateIncentive.js');

const port = process.env.PORT || 8080;
const app = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.listen(port);

console.log('server started on port ', port);

app.post('/calculateIncentive', (request, response) => {
  calculate(request.body.location, request.body.cart, client, response);
});
// client.generate();
// console.log(geodist(
//             { lat: 38.017144, lon: -122.288581 },
//             { lat: 30.267, lon: -97.743 },
//             {exact: true, unit: 'km'},
//           ), 'HELLO');

const faker = require('faker');
const _ = require('underscore');

const randomWarehouse = () => {
  let warehouses = [{ name: 'San Fransico', latitude: 37.775, longitude: -122.419 }, { name: 'Chicago', latitude: 41.878, longitude: -87.629 }, { name: 'Austin', latitude: 30.267, longitude: -97.743 }, { name: 'Miami', latitude: 25.762, longitude: -80.192 }, { name: 'New York', latitude: 40.713, longitude: -74.006 }];
  const array = [];
  warehouses = _.shuffle(warehouses);
  const amount = Math.round((Math.random() * 4) + 1);
  for (let i = 0; i < amount; i += 1) {
    array.push(warehouses[i]);
  }
  return array;
};

const insertMany = (client, counter) => {
  const arr = [];
  const quer = 'INSERT INTO products (id, height, length, price, primeeligible, warehouses, weight, width, quantity, name) VALUES (now(),?,?,?,?,?,?,?,?,?)';
  let bool = 0;
  let boolean = true;
  for (let i = 0; i < 100; i += 1) {
    if (bool >= 3) {
      bool = 0;
      boolean = false;
    }
    arr.push({ query: quer, params: [parseFloat(Number(Math.random() * 4500).toFixed(2)), parseFloat(Number(Math.random() * 4500).toFixed(2)), parseFloat(Number(Math.random() * 100).toFixed(2)), boolean, randomWarehouse(), parseFloat(Number(Math.random() * 30).toFixed(2)), parseFloat(Number(Math.random() * 4500).toFixed(2)), Math.floor(Math.random() * 3000), faker.commerce.productName()] });
    boolean = true;
    bool+=1;
  }
  client.batch(arr, { prepare: true }).then(() => {counter += 100; console.log(counter); insertMany(client, counter);}).catch((err) => { console.log(err); });
};

const clearDB = (client) => {
  const query = 'TRUNCATE products';
  client.execute(query)
    .then(result => console.log(result)).catch((err) => { console.log(err); });
};

module.exports = { insertMany, clearDB };




// // [{name:'texas',latitude:1,longtiude:1},{name:'california',latitude:1,longtiude:1}]
// // INSERT INTO products (id, height, length, price, primeeligible, warehouses, weight, width) VALUES (now(),?,?,?,?,?,?,?)


// // INSERT INTO products (id, height, length, price, primeeligible, weight, width) VALUES (now(), 1 ,1 ,1, false,1,1);
// var product = [faker.commerce.productName(), parseFloat(Number(Math.random()*100).toFixed(2)), Math.floor(Math.random()*3000), faker.random.boolean(), faker.address.state(), parseFloat(Number(Math.random()*4500).toFixed(2)), parseFloat(Number(Math.random()*4500).toFixed(2)), parseFloat(Number(Math.random()*4500).toFixed(2)), parseFloat(Number(Math.random()*30).toFixed(2)), Math.random()*20 + 30, -1* (Math.random()* 55 + 70)];




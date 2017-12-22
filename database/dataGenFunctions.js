const faker = require('faker');
const _ = require('underscore');
// const elastic = require('../ElasticSearch/indexs');

// elastic.deleteIndex()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// elastic.initIndex()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// elastic.initMapping()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const num_warehouses = [1, 2, 3, 4, 5];
const weights = [ .03, .07, .2, .3, .4];
const weighted_list = [];
for (let k = 0; k < num_warehouses.length; k += 1) {
  for (let j = 0; j < weights[k] * 100; j += 1) {
    weighted_list.push(num_warehouses[k]);
  }
}
const randomWarehouse = () => {
  let warehouses = [{ name: 'San Fransico', latitude: 37.775, longitude: -122.419 }, { name: 'Chicago', latitude: 41.878, longitude: -87.629 }, { name: 'Austin', latitude: 30.267, longitude: -97.743 }, { name: 'Miami', latitude: 25.762, longitude: -80.192 }, { name: 'New York', latitude: 40.713, longitude: -74.006 }];
  const array = [];
  const obj = { 'San Fransico': false,
    Miami: false,
    Chicago: false,
    'New York': false,
    Austin: false,
  };
  warehouses = _.shuffle(warehouses);
  const amount = Math.floor((Math.random() * 100));
  for (let i = 0; i < weighted_list[amount]; i += 1) {
    array.push(warehouses[i]);
    obj[warehouses[i].name] = true;
  }
  array.push(obj);
  array.push(weighted_list[amount]);
  return array;
};

const insertMany = (client, counter) => {
  const arr = [];
  let info = [];
  const quer = 'INSERT INTO test (p_id, height, length, price, primeeligible, warehouses, weight, width, quantity, name) VALUES (?,?,?,?,?,?,?,?,?,?)';
  let bool = 0;
  let boolean = true;
  for (let i = 0; i < 100; i += 1) {
    if (bool >= 3) {
      bool = 0;
      boolean = false;
    }
    const x = randomWarehouse();
    const num = x.pop();
    const y = x.pop();
    info = [counter + i + 1, parseFloat(Number(Math.random() * 4500).toFixed(2)),
      parseFloat(Number(Math.random() * 4500).toFixed(2)),
      parseFloat(Number(Math.random() * 100).toFixed(2)), boolean,
      x, parseFloat(Number(Math.random() * 30).toFixed(2)),
      parseFloat(Number(Math.random() * 4500).toFixed(2)), Math.floor(Math.random() * 3000),
      faker.commerce.productName()];

    arr.push({ query: quer, params: info });
    // elastic.addDocument(info, [y['San Fransico'], y['Miami'], y['Chicago'], y['New York'], y['Austin']], num);
    boolean = true;
    bool += 1;
  }

  client.batch(arr, { prepare: true })
    .then(() => {
      console.log(counter + 100);
      if (counter + 100 < 10000000) {
        setTimeout(insertMany.bind(null, client, counter + 100), 18);
      }
    })
    .catch((err) => { console.log(err); });
};

const clearDB = (client) => {
  const query = 'TRUNCATE test';
  client.execute(query)
    .then(result => console.log(result)).catch((err) => { console.log(err); });
};

const search = (client, arr) => {
  let query = 'SELECT * FROM test WHERE p_id IN ';
  const len = arr.length;
  for (let i = 0; i < len; i += 1) {
    if (i === 0) {
      query += '(' + arr[i] + '';
    } else if (i === len - 1) {
      query += ',' + arr[i] + ')';
    } else {
      query += ',' + arr[i] + '';
    }
  }
  return client.execute(query);
};

module.exports = { insertMany, clearDB, search };

// [{name:'texas',latitude:1,longtiude:1},{name:'california',latitude:1,longtiude:1}]
// INSERT INTO products (id, height, length, price, primeeligible, warehouses, weight, width) VALUES (now(),?,?,?,?,?,?,?)


// INSERT INTO products (id, height, length, price, primeeligible, weight, width) VALUES (now(), 1 ,1 ,1, false,1,1);
// var product = [faker.commerce.productName(), parseFloat(Number(Math.random()*100).toFixed(2)), Math.floor(Math.random()*3000), faker.random.boolean(), faker.address.state(), parseFloat(Number(Math.random()*4500).toFixed(2)), parseFloat(Number(Math.random()*4500).toFixed(2)), parseFloat(Number(Math.random()*4500).toFixed(2)), parseFloat(Number(Math.random()*30).toFixed(2)), Math.random()*20 + 30, -1* (Math.random()* 55 + 70)];

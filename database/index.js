const cassandra = require('cassandra-driver');
const helper = require('./dataGenFunctions');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'inventory' });

client.connect((err) => {
  if (err) {
    console.log('Cassandra connection failed!!');
  } else {
    console.log('Cassandra connected!!');
  }
});

const clearDB = () => {
  helper.clearDB(client);
};
const generate = () => {
  helper.insertMany(client, 0);
};

module.exports = { generate, clearDB };


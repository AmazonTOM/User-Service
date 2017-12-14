const elasticsearch = require('elasticsearch');

const elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info',
});

const indexName = 'products';

/**
* Delete an existing index
*/
function deleteIndex() {
  return elasticClient.indices.delete({
    index: indexName,
  });
}


/**
* create the index
*/
function initIndex() {
  return elasticClient.indices.create({
    index: indexName,
  });
}


/**
* check if the index exists
*/
function indexExists() {
  return elasticClient.indices.exists({
    index: indexName,
  });
}


const initMapping = () => {
  const doc = 'document';
  return elasticClient.indices.putMapping({
    index: indexName,
    type: doc,
    body: {
      properties: {
        id: { type: 'integer' },
        name: { type: 'text' },
        height: { type: 'float' },
        length: { type: 'float' },
        width: { type: 'float' },
        weight: { type: 'float' },
        price: { type: 'float' },
        primeeligible: { type: 'boolean' },
        quantity: { type: 'integer' },
        warehouses: {
          type: 'nested',
          properties: {
            name: { type: 'text' },
            latitude: { type: 'float' },
            longitude: { type: 'float' },
          },
        },
      },
    },
  });
};

function addDocument(document) {
  return elasticClient.index({
    index: indexName,
    type: 'document',
    body: {
      id: document[0],
      name: document[9],
      height: document[1],
      length: document[2],
      width: document[7],
      weight: document[6],
      price: document[3],
      primeeligible: document[4],
      quantity: document[8],
      warehouses: document[5],
    },
  });
}

module.exports = {
  initMapping,
  indexExists,
  initIndex,
  deleteIndex,
  addDocument,
};

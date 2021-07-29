const { MongoClient } = require("mongodb");
const config = require('./config.service');

const client = new MongoClient(config.mongo_url, { useUnifiedTopology: true });
client.connect();

function close() {
    client.close();
}

module.exports.client = client;
module.exports.close = close;
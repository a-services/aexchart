const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    app_env: process.env.app_env,
    app_port: process.env.app_port,

    host_name: process.env.host_name,

    mongo_url: process.env.mongo_url,
    mem_db: process.env.mem_db,
    req_db: process.env.req_db
}
const mysql = require('mysql');
const config = require('../config');

export const Connection = mysql.createConnection(config.mysql);

Connection.connect(err => {
    console.log(err);
});
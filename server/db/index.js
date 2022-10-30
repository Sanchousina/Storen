import * as mysql from 'mysql2';
import config from '../config/index.js';
import user from './user.js';
import advert from './advert.js';

export const Connection = mysql.createConnection(config.mysql);

Connection.connect(err => {
    console.log(err);
});

export default {
    user,
    advert
}
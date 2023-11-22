import * as mysql from 'mysql2';
import config from '../config/index.js';
import user from './user.js';
import advert from './advert.js';
import warehouse from './warehouse.js';
import contract from './contract.js';
import favorite from './favorite.js';
import gallery from './gallery.js';

export const connection = mysql.createConnection(config.mysql);

connection.connect(err => {
    console.log(err);
});

export default {
    user,
    advert,
    warehouse,
    contract,
    favorite,
    gallery
}
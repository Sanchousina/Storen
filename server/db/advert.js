import { Connection } from './index.js';

export const all = async () => {
    return new Promise((resolve, reject) => {
        Connection.query(`SELECT * from Advert`, (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
}

export const one = async (id) => {
    return new Promise((resolve, reject) => {
        Connection.query(`SELECT * from Advert WHERE advert_id = ?`, [id] , (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results[0]);
        });
    });
}

export default {
    all,
    one
}
import { Connection } from './index.js';

export const all = () => {
    return new Promise((resolve, reject) => {
        Connection.query(`SELECT * from Advert`, (err, results) => {
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        });
    });
}

export const one = (id) => {
    return new Promise((resolve, reject) => {
        Connection.query(`SELECT * from Advert WHERE advert_id = ?`, [id] , (err, results) => {
            if(err){
                reject(err);
            }else{
                resolve(results[0]);
            }
        });
    });
}

export default {
    all,
    one
}
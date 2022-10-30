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

export default {
    all
}
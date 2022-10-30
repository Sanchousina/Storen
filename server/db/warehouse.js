import { Connection } from './index.js';

export const one = async(id) => {
    return new Promise((resolve, reject) => {
        Connection.query(`SELECT * from Warehouse WHERE warehouse_id = ?`, [id],
        (err, results) => {
            if(err) {
                reject(err);
            }
            resolve(results);
        })
    })
}

export default {
    one
}
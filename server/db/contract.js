import { Connection } from "./index.js";

export const all = async (id) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `SELECT * FROM Contract
            WHERE user_id = ?`, [id],
            (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
}

export const one = async (id) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `SELECT * FROM Contract
            WHERE contract_id = ?`, [id],
            (err, results) => {
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
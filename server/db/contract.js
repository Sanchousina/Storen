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

export const createNew = async (arr) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `INSERT INTO Contract (user_id, warehouse_id, initial_date, expiry_date, space_size, contract_url, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`, [...arr],
            (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results.insertId);
        });
    });
}

export const reject = async (id) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `UPDATE Contract
            SET status = "rejected"
            WHERE contract_id = ?`, [id],
            (err, results) => {
            if(err){
                reject(err);
            }
            resolve();
        });
    });
}

export default {
    all,
    one,
    createNew,
    reject
}
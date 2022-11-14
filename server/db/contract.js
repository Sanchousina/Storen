import { connection } from "./index.js";

export const all = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
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

export const allByStatus = async (id, status) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM Contract
            WHERE user_id = ? && status = ?`, [id, status],
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
        connection.query(
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

export const getContractInfo = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT contract_name, space_size, warehouse_id 
            FROM Contract
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
        connection.query(
            `INSERT INTO Contract (user_id, warehouse_id, initial_date, expiry_date, space_size, contract_name, status)
            VALUES (?, ?, ?, ?, ?, ?, "pending")`, [...arr],
            (err, results) => {
            if(err){
                reject(err);
            }
            console.log(results);
            resolve(results.insertId);
        });
    });
}

export const reject = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
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

export const accept = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE Contract
            SET status = "accepted"
            WHERE contract_id = ?`, [id],
            (err, results) => {
            if(err){
                reject(err);
            }
            resolve();
        });
    });
}

export const deleteOne = async (id) => {
    console.log(id);
    return new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM Contract
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
    allByStatus,
    one,
    createNew,
    reject,
    accept,
    deleteOne,
    getContractInfo
}
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

export const createNew = async (arr) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `INSERT INTO Advert (warehouse_id, user_id, creation_date, rental_rate, description, original_document_url)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [...arr] , (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results.insertId);
        });
    });
}

export default {
    all,
    one,
    createNew
}
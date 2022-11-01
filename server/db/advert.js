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
            `INSERT INTO Advert (user_id, creation_date, rental_rate, description, original_document_url, title)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [...arr] , (err, results) => {
            if(err){
                reject(err);
            }
            console.log(results);
            resolve(results.insertId);
        });
    });
}

export const update = async (arr) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `UPDATE Advert
            SET rental_rate = ?, description = ?, title = ?
            WHERE advert_id = ?`,
            [...arr] , (err, results) => {
            if(err){
                reject(err);
            }
            resolve();
        });
    });
}

export const deleteOne = async (id) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `DELETE FROM Advert
            WHERE advert_id = ?`,
            [id] , (err, results) => {
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
    update,
    deleteOne
}
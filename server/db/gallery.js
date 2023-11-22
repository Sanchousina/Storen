import { connection } from './index.js'

export const all = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM gallery
            WHERE advert_id = ?`, [id],
            (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results);
            }
        );
    });
}

export const one = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT * FROM gallery
            WHERE image_id = ?`, [id],
            (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results[0]);
            }
        );
    });
}

export const insert = async (id, image_name) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO Gallery (advert_id, image_name)
            VALUES (?, ?)`, [id, image_name],
            (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results);
            }
        );
    });
}

export const deleteAll = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM Gallery
            WHERE advert_id = ?`, [id],
            (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results);
            }
        );
    });
}

export const deleteOne = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM Gallery
            WHERE image_id = ?`, [id],
            (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results);
            }
        );
    });
}

export default {
    all,
    one,
    insert,
    deleteAll,
    deleteOne
}
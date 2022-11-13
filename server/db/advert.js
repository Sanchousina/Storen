import { Connection } from './index.js';

export const all = async (sql) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `SELECT advert.advert_id, title, city, 
            available_space, rental_rate, type, MIN(image_name) as image_name
            FROM advert
            INNER JOIN warehouse ON advert.advert_id = warehouse.advert_id
            INNER JOIN gallery ON warehouse.advert_id = gallery.advert_id
            ${sql}
            GROUP BY advert_id`, 
            (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
}

export const allByCity = async (city) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `SELECT advert.advert_id, advert.title, warehouse.city, 
            warehouse.available_space, warehouse.type, MIN(gallery.image_name) as image_name
            FROM advert
            INNER JOIN warehouse ON advert.advert_id = warehouse.advert_id
            INNER JOIN gallery ON warehouse.advert_id = gallery.advert_id
            WHERE city = ?
            GROUP BY advert_id`, [city],
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
            `SELECT * from Advert 
            INNER JOIN warehouse ON advert.advert_id = warehouse.advert_id
            WHERE advert.advert_id = ?`, [id] , (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results[0]);
        });
    });
}

export const getDoc = async (id) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `SELECT document_name from Advert 
            WHERE advert_id = ?`, [id] , (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results[0].document_name);
        });
    });
}

export const createNew = async (arr) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `INSERT INTO Advert (user_id, creation_date, rental_rate, description, document_name, title)
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
    allByCity,
    one,
    getDoc,
    createNew,
    update,
    deleteOne
}
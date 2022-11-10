import { Connection } from './index.js'

export const all = async (id) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `SELECT image_name FROM gallery
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

export const insert = async (id, image_name) => {
    return new Promise((resolve, reject) => {
        Connection.query(
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

export default {
    all,
    insert
}
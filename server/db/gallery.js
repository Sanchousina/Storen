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

export default {
    all
}
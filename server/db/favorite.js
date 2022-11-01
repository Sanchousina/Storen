import { Connection } from "./index.js";

export const toFavorite = async(advert, user) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `INSERT INTO Favorite (advert_id, user_id)
            VALUES (?, ?)`, [advert, user],
            (err, results) => {
            if(err){
                reject(err);
            }
            resolve();
        });
    });
}

export default {
    toFavorite
}
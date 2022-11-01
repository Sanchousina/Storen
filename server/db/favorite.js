import { Connection } from "./index.js";

//TODO:
// export const all = async(user) => {
//     return new Promise((resolve, reject) => {
//         Connection.query(
//             `SELECT * FROM Favorite`, [advert, user],
//             (err, results) => {
//             if(err){
//                 reject(err);
//             }
//             resolve();
//         });
//     });
// }

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

export const unFavorite = async(advert, user) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `DELETE FROM Favorite
            WHERE advert_id = ? && user_id = ?`, [advert, user],
            (err, results) => {
            if(err){
                reject(err);
            }
            resolve();
        });
    });
}

export default {
    toFavorite,
    unFavorite
}
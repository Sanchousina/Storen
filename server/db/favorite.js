import { connection } from "./index.js";

export const all = async(userId) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT advert.advert_id, advert.title, warehouse.city, 
            warehouse.available_space, warehouse.type, MIN(gallery.image_name) AS image_name
            FROM advert
            INNER JOIN warehouse ON advert.advert_id = warehouse.advert_id
            INNER JOIN gallery ON warehouse.advert_id = gallery.advert_id
            INNER JOIN favorite ON gallery.advert_id = favorite.advert_id
            WHERE favorite.user_id = ?
            GROUP BY advert_id`, 
            [userId],
            (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
}

export const checkIfFavorite = async (advertId, userId) => {
    return new Promise ((resolve, reject) => {
        connection.query(
            `SELECT EXISTS (SELECT advert_id FROM favorite
            WHERE advert_id = ? AND user_id = ?) AS check_fav;`, 
            [advertId, userId],
            (err, results) => {
                if(err){
                    reject(err);
                }else{
                    resolve(results[0].check_fav);
                }
            }
        )
    })
}

export const toFavorite = async(advertId, userId) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO Favorite (advert_id, user_id)
            VALUES (?, ?)`, [advertId, userId],
            (err, results) => {
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
}

export const unFavorite = async(advertId, userId) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM Favorite
            WHERE advert_id = ? AND user_id = ?`, [advertId, userId],
            (err, results) => {
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
}

export default {
    all,
    toFavorite,
    unFavorite,
    checkIfFavorite
}
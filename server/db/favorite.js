import { Connection } from "./index.js";

export const all = async(user) => {
    return new Promise((resolve, reject) => {
        Connection.query(
            `SELECT advert.advert_id, advert.title, warehouse.city, 
            warehouse.available_space, warehouse.type, MIN(gallery.image_name) AS image_name
            FROM advert
            INNER JOIN warehouse ON advert.advert_id = warehouse.advert_id
            INNER JOIN gallery ON warehouse.advert_id = gallery.advert_id
            INNER JOIN favorite ON gallery.advert_id = favorite.advert_id
            WHERE favorite.user_id = ?
            GROUP BY advert_id`, 
            [user],
            (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
}

export const checkIfFavorite = async (advert, user) => {
    return new Promise ((resolve, reject) => {
        Connection.query(
            `SELECT EXISTS (SELECT advert_id from favorite
            WHERE advert_id = ? AND user_id = ?) AS check_fav;`, 
            [advert, user],
            (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results[0].check_fav);
            }
        )
    })
}

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
    all,
    toFavorite,
    unFavorite,
    checkIfFavorite
}
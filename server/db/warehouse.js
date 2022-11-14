import { connection } from './index.js';

export const one = async(id) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * from Warehouse WHERE advert_id = ?`, [id],
        (err, results) => {
            if(err) {
                reject(err);
            }
            resolve(results);
        })
    })
}

export const createNew = async(arr) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO Warehouse (advert_id, city, street, house_num, zip, type, available_space, total_space, seiling_height, 
                temperature, humidity, year_built, parking_slots, use_machinery)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [...arr], 
            (err, results) => {
                if(err){
                    reject(err);
                }
                resolve(results.insertId);
            }
        );
    });
}

export const update = async(arr) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE Warehouse
            SET city = ?, street = ?, house_num = ?, zip = ?, type = ?, 
            available_space = ?, total_space = ?, seiling_height = ?, temperature = ?,
            humidity = ?, year_built = ?, parking_slots = ?, use_machinery = ?
            WHERE warehouse_id = ?`, [...arr], 
            (err, results) => {
                if(err){
                    reject(err);
                }
                resolve();
            }
        );
    });
}

export const updateAvailableSpace = async (space, id) => {
    return new Promise ((resolve, reject) => {
        connection.query(
            `UPDATE warehouse
            SET available_space = available_space - ?
            WHERE warehouse_id = ?`,
            [space, id],
            (err, results) => {
                if(err){
                    reject(err);
                }
                resolve();
            }
        );
    });
}

export const getTypes = async () => {
    return new Promise ((resolve, reject) => {
        connection.query(
            `SELECT TRIM(TRAILING ")" FROM SUBSTRING(COLUMN_TYPE,6)) as typeVals
            FROM information_schema.COLUMNS
            WHERE TABLE_NAME='Warehouse'
            AND COLUMN_NAME='type'`,
            (err, results) => {
                if(err){
                    reject(err);
                }
                const typeVals =results[0].typeVals;
                const tempString = typeVals.replace(/\'/g, '');
                const enumArray = tempString.split(',');
                resolve(enumArray);
            }
        )
    })
}

export default {
    one,
    createNew,
    update,
    updateAvailableSpace,
    getTypes
}
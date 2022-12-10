import { connection } from './index.js';

export const one = async(id) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * from Warehouse WHERE advert_id = ?`, [id],
        (err, results) => {
            if(err) {
                reject(err);
            }else{
                resolve(results);
            }
        })
    })
}

export const getRequiredTemp = async(warehouseId) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT temperature FROM Warehouse WHERE warehouse_id = ?`, 
            [warehouseId], (err, results) => {
            if(err) {
                reject(err);
            }else{
                resolve(results[0]);
            }
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
                }else{
                    resolve(results.insertId);
                }
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
            WHERE advert_id = ?`, [...arr], 
            (err, results) => {
                if(err){
                    reject(err);
                }else{
                    resolve();
                }
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
                }else{
                    resolve();
                }
            }
        );
    });
}

export const updateTempAndHumidity = async (temp, humidity, warehouseId) => {
    return new Promise ((resolve, reject) => {
        connection.query(
            `UPDATE warehouse
            SET current_t = ?, current_h = ?
            WHERE warehouse_id = ?`,
            [temp, humidity, warehouseId],
            (err, results) => {
                if(err){
                    reject(err);
                }else{
                    resolve();
                }
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
                }else{
                    const typeVals =results[0].typeVals;
                    const tempString = typeVals.replace(/\'/g, '');
                    const enumArray = tempString.split(',');
                    resolve(enumArray);
                }
            }
        )
    })
}

export default {
    one,
    createNew,
    update,
    updateAvailableSpace,
    getRequiredTemp,
    updateTempAndHumidity,
    getTypes
}
import { Connection } from './index.js';

export const one = async(id) => {
    return new Promise((resolve, reject) => {
        Connection.query(`SELECT * from Warehouse WHERE warehouse_id = ?`, [id],
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
        Connection.query(
            `INSERT INTO Warehouse (city, street, house_num, zip, type, available_space, total_space, seiling_height, 
                temperature, humidity, year_built, parking_slots, use_machinery)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [...arr], 
            (err, results) => {
                if(err){
                    reject(err);
                }
                //console.log(results.insertId);
                resolve(results.insertId);
            }
        );
    });
}

export default {
    one,
    createNew
}
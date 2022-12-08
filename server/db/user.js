import { connection } from "./index.js";

export const all = async() => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT user_id, email, first_name, last_name, phone, company, role
            FROM User`, (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
}

export const one = async(id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT user_id, email, first_name, last_name, phone, company, role
            FROM User WHERE user_id = ?`, 
        [id] , (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results[0]);
        });
    });
}

export const findUserByEmail = async(email) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * from User WHERE email = ?`, 
        [email] , (err, results) => {
            if(err){
                reject(err);
            }else{
                resolve(results[0]);
            }
        });
    });
}

export const register = async(arr) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO User (email, password, first_name, last_name, phone, company)
            VALUES (?, ?, ?, ?, ?, ?)`, [...arr],
            (err, results) => {
            if(err){
                reject(err);
            }else{
                resolve(results.insertId);
            }
        });
    });
}

export const editUserInfo = async(arr) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `UPDATE User
            SET email = ?, first_name = ?, last_name = ?, phone = ?, company = ?
            WHERE user_id = ?`, [...arr],
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
    one,
    findUserByEmail,
    editUserInfo,
    register
}
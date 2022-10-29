import { Connection } from "./index.js";

export const all = async() => {
    return new Promise((resolve, reject) => {
        Connection.query("SELECT * from User", (err, results) => {
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
}

export default {
    all
}
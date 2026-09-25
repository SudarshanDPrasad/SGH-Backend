import mysql from "mysql2";
import "dotenv/config";

const db = mysql.createPool({
    host: "mysql-123064e-sgh-dataentry.b.aivencloud.com",
    user: "avnadmin",
    port: 11912,
    password: process.env.DB_PASSWORD,
    database: "defaultdb"
}).promise();

export async function userDetails(userName,imageUrl, mobileNumber,gender,checkindate,pov,city,roomNo) {
    const insert = await db.query('INSERT INTO `defaultdb`.`sghdataentry-database` (user_name,imageUrl, mobileNumber,gender,checkindate,pov,city,roomNo) VALUES (?,?)',
    [userName,imageUrl,mobileNumber,gender,checkindate,pov,city,roomNo]);
    return insert[0];
}

export async function userDetailsSearch(mobileNumber) {
    const query = await db.execute('SELECT * FROM `defaultdb`.`sghdataentry-database` WHERE mobileNumber like ? ORDER BY user_name',[`%${mobileNumber}%`]);
    return query[0];
}
import mysql from "mysql2";
import "dotenv/config";

const db = mysql.createPool({
    host: "mysql-123064e-sgh-dataentry.b.aivencloud.com",
    user: "avnadmin",
    port: 11912,
    password: process.env.DB_PASSWORD,
    database: "defaultdb"
}).promise();

export async function userDetails(userName,imageUrl) {
    const insert = await db.query('INSERT INTO `defaultdb`.`sghdataentry-database` (user_name,imageUrl) VALUES (?,?)',[userName,imageUrl]);
    return insert[0];
}
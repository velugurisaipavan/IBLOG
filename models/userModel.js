const sql = require('../db/mysql_connect')
const bcrypt = require("bcrypt")

//* CREATES NEW USER
const registerUser = async (userData, result) => {
    await sql.query(`CREATE TABLE IF NOT EXISTS Users(
    user_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
)`, (err, res) => {
        console.log("Create Users", err, res)
    })
    const {first_name, last_name, user_password, user_email} = userData;
    await isUserExist(user_email, (existUserErr, data) => {
        if (existUserErr) throw new Error(existUserErr)
        if (data.length > 0) return result("User already exist", null)
        sql.query(`INSERT INTO Users (first_name, last_name, user_password, user_email)VALUES ("${first_name}", "${last_name}", "${user_password}", "${user_email}")`, (err, res) => {
            if (err) {
                console.log("Error: " + err);
                result(err, null);
                return
            }
            console.log("Success: ", res)
            result(null, {id: res.insertId, ...userData});
        })
    })

}

//* LOGIN USER INTO APP
const loginUser = async (userData, callback) => {
    const {user_email, user_password} = userData;
    await sql.query(`SELECT * FROM Users WHERE user_email="${user_email}" LIMIT 1`, async (err, res) => {
        if (err) {
            console.log("Error: " + err)
            callback(err, null)
            return
        }
        if (res.length == 0) return callback(`User not found following email: ${user_email}`, null)
        const isPasswordMatch = await bcrypt.compare(user_password, res[0].user_password)
        if (!isPasswordMatch) {
            callback("Password doesnt match", null)
            return;
        }
        callback(null, res[0])
    })

}

//* EDIT USER BY ITS ID
const editUser = async (userData, callback) => {
    const {first_name, last_name, user_email, user_id} = userData;
    await sql.query(`UPDATE Users SET first_name="${first_name}", last_name="${last_name}", user_email ="${user_email}" WHERE user_id="${user_id}"`, async (err, res) => {
        if (err) {
            callback(err, null)
            return
        }
        await sql.query(`SELECT * FROM Users WHERE user_id = "${user_id}"`, (getErr, user) => {
            if (getErr) {
                callback(getErr, null)
                return

            }
            if (user.length == 0) {
                callback(`Not found following id: ${user_id}`, null)
                return
            }
            callback(null, user[0])
        })
    })
}

//* DELETE USER FROM APP
const deleteUser = async (id, callback) => {
    await sql.query(`DELETE FROM Users WHERE user_id = "${id}"`, (err, res) => {
        if (err) {
            callback(err, null)
            return;
        }
        callback(null, res)
    })
}

//* CHECK IF USER ALREADY SIGNED UP
const isUserExist = async (email, callback) => {
    sql.query(`SELECT * FROM Users WHERE user_email="${email}" LIMIT 1`, (err, res) => {
        if (err) {
            console.log("Error: " + err)
            callback(err, null)
            return
        }
        callback(null, res)
    })
}

module.exports = {registerUser, loginUser, editUser, deleteUser};
const sql = require("../db/mysql_connect")

//* CREATE CATEGORY
const createCategory = async (data, callback) => {
    await sql.query(`CREATE TABLE IF NOT EXISTS Categories(
    category_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    category_name VARCHAR(255)
)`)
    const {category_name} = data;
    await sql.query(`INSERT INTO Categories(category_name) VALUES("${category_name}")`, async (err, res) => {
        if (err) {
            callback(err, null)
            return
        }
        await sql.query(`SELECT * FROM Categories WHERE category_name="${category_name}"`, (getError, getData) => {
            if (getError) {
                callback(getError, null)
                return
            }
            if (getData.length == 0) {
                callback(`Not found following catgory_name ${category_name}`, null)
            }

            callback(null, getData[0])
        })
    })
}


//* LOOKUP CATEGORY BY NAME
const lookupCategory = async (searchValue, callback) => {
    await sql.query(`SELECT * FROM Categories WHERE category_name LIKE "${searchValue}%"`, (err, res) => {
        if (err) {
            callback(err, null)
            return
        }
        callback(null, res)
    })
}
//* GET CATEGORIES
const getAllCategory = async (callback) => {
    await sql.query(`SELECT * FROM Categories`, (err, res) => {
        if (err) {
            callback(err, null)
            return
        }
        callback(null, res)
    })
}

//* GET CATEGORY BY ID
const getCategoryById = async (category_id, callback) => {
    await sql.query(`SELECT * FROM Categories WHERE category_id="${category_id}" LIMIT 1`, (err, res) => {
        if (err) {
            callback(err, null)
            return
        }
        if (res.length == 0) {
            callback(`Not found following id: ${category_id}`, null)
            return
        }

        callback(null, res[0])
    })
}

module.exports = {createCategory, lookupCategory, getAllCategory, getCategoryById}
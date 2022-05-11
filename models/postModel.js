const sql = require("../db/mysql_connect")

//* CREATES NEW POST BY USER
const createPost = async (postData, callback) => {
    await sql.query(`CREATE TABLE IF NOT EXISTS Posts(
    post_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title MEDIUMTEXT,
    content LONGTEXT,
    photo VARCHAR(255),
    post_author_id INT,
    category_id INT,
    post_category_name VARCHAR(255),
    FOREIGN KEY (post_author_id) REFERENCES Users(user_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
)`, (err, res) => {
        console.log("posts table", err, res)
    })
    const {title, content, photo, post_author_id, category_id, post_category_name} = postData;
    await sql.query(`INSERT INTO Posts(title, content, photo, post_author_id, category_id, post_category_name) 
     VALUES("${title}", "${content}", "${photo}", "${post_author_id}", "${category_id}", "${post_category_name}")`, (err, res) => {
        if(err) return callback(err, null)
        callback(null, res)
    })
}

//* EDITS EXISTING POST BY ID
const editPost = async (postData, callback) => {
    const {title, content, photo, post_id} = postData;
    await sql.query(`UPDATE Posts SET title="${title}", content="${content}", photo="${photo}" WHERE post_id = "${post_id}"`, (err, res) => {
        if(err) {
            callback(err, null)
            return
        }
        callback(null, res)
    })
}

//* DELETES EXISTING POST BY ID
const deletePost = async (id, callback) => {
    await sql.query(`DELETE FROM Posts WHERE post_id = "${id}"`, (err, res) => {
        if(err) {
            callback(err, null)
            return;
        }
        callback(null, res)
    })
}

//* GET ALL POSTS
const getAllPosts = async (callback) => {
    await sql.query('SELECT * FROM Posts', async (err, res) => {
        if(err) {
            callback(err, null)
            return
        }

        callback(null, res)
    })
}

//* GET ONE POST BY ID
const getPostById = async(postId, callback) => {
    await sql.query(`SELECT * FROM Posts WHERE post_id=${postId} LIMIT 1`, (err, res) => {
        if(err) {
            callback(err, null)
            return
        }
        callback(null, res)
    })
}

//* GET ALL POSTS USER POSTED
const getUserPosts = async(user_id, callback) => {
    await sql.query(`SELECT * FROM Posts WHERE post_author_id=${user_id}`, (err, res) => {
        if(err) {
            callback(err, null)
            return
        }
        callback(null, res)
    })
}

//* GET ALL POSTS RELATED TO CATEGORY
const getPostByCategoryId = async (categoryId, callback) => {
    await sql.query(`SELECT * FROM Posts WHERE category_id=${categoryId}`, (err, res) => {
        if(err) {
            callback(err, null)
            return
        }
        callback(null, res)
    })
}




module.exports = {createPost, editPost, deletePost, getAllPosts, getUserPosts, getPostById, getPostByCategoryId};
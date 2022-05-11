const sql = require("../db/mysql_connect")

//* CREATE COMMENT
const createComment = async (data, callback) => {
    await sql.query(`CREATE TABLE IF NOT EXISTS Comments(
    comment_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    author_email VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    content VARCHAR(255),
    post_id INT,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
)`, (err, res) => {
        console.log("Comment table", err, res)
    })
    const {author_email, author_name, content, post_id} = data;
    await sql.query(`INSERT INTO Comments(author_email, author_name, content, post_id) VALUES("${author_email}", "${author_name}", "${content}", "${post_id}")`, (err, res) => {
        if (err) {
            callback(err, null)
            return
        }
        callback(null, res);
    })
}
//* UPDATE COMMENT
const updateComment = async (id, data, callback) => {
    const {content} = data;
    await sql.query(`UPDATE Comments SET content="${content}" WHERE comment_id="${id}"`, (err, res) => {
        if (err) {
            callback(err, null)
            return
        }
        callback(null, res)
    })
}

//* DELETE COMMENT BY ID
const deleteComment = async (id, callback) => {
    await sql.query(`DELETE FROM Comments WHERE comment_id="${id}"`, (err, res) => {
        if (err) {
            callback(err, null)
            return
        }
        callback(null, res)
    })
}

//* GET COMMENTS BY POST ID
const getCommentByPostId = async (postId, callback) => {
    await sql.query(`SELECT * FROM Comments WHERE post_id="${postId}"`, (err, res) => {
        if (err) {
            callback(err, null)
            return
        }
        callback(null, res)
    })
}


module.exports = {createComment, updateComment, deleteComment, getCommentByPostId}
const express = require("express")
const Comments = require("../models/commentModel")
const router = express.Router()

//* POST => creates new comment
router.post("/newComment", async (req, res) => {
    await Comments.createComment(req.body, (error, data) => {
        if(error) return res.status(500).send({message: "Error while creating comment", error: error})
        res.json({message: "Comment created successfully"})
    })
})

//* UPDATE => updates existing content by id
router.put("/editComment/:id", async (req, res) => {
    const id = req.params.id
    await Comments.updateComment(id, req.body, (error, data) => {
        if(error) return res.status(500).send({message: "Error while updating comment"})
        if(data.fieldCount == 0 && data.affectedRows == 0) return res.status(404).send({message: `Comment not found following id: ${id}`})
        res.json({message: "Updated successfully"})
    })
})

//* DELETE => deletes existing content by id
router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id
    await Comments.deleteComment(id, (error, data) => {
        if(error) return res.status(500).send({message: "Error while deleting comment", error: error})
        if(data.fieldCount == 0 && data.affectedRows == 0) return res.status(404).send({message: `Deleting comment not found following id: ${id}`})
        res.json({message: "Deleted successfully"})
    })
})

//* GET gets all comments posted to post
router.get("/getPostComment/:id", async (req, res) => {
    const id = req.params.id;
    await Comments.getCommentByPostId(id, (error, data) => {
        if(error) return res.status(500).send({message: "Error while getting comments", error: error})
        if(data.length == 0) return res.status(404).send({message: `Comments not found following id: ${id}`})
        res.json(data)
    })
})

module.exports = router
const express = require('express')
const Posts = require('../models/postModel')
const Category = require("../models/categoryModel")
const auth = require('../middleware/auth')
const multer = require('multer')
const path = require('path')
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

//* POST => creates new post
router.post('/createPost', auth, upload.single("photo"), async (req, res) => {
    const user = req.user;
    const photo = `/uploads/${req.file.filename}`
    await Category.getCategoryById(req.body.category_id, async (getError, getData) => {
        if(getError) return res.status(500).send({message: "Error while getting category", error: getError})
        await Posts.createPost({post_author_id: user.id, post_category_name: getData.category_name, photo: photo, ...req.body}, (createErr, data) => {
            if (createErr) return res.status(500).send({message: 'Error while creating post', err: createErr})
            res.json(data)
        })

    })


})

//* UPDATE => updates existing post by id
router.put("/editPost/:id", auth, upload.single("photo"), async (req, res) => {
    const id = req.params.id
    const photo = `/uploads/${req.file.filename}`

    await Posts.editPost({post_id: id, photo: photo,  ...req.body}, (editErr, data) => {
        if (editErr) return res.status(500).send({message: 'Error while editing post', error: editErr})
        if (data.affectedRows == 0 && data.fieldCount == 0) return res.status(404).send({message: `Requested resource not available by following id: ${id}`})
        res.json({message: "Post edited successfully"})
    })
})

//* DELETE => deletes existing post by id
router.delete('/deletePost/:id', auth, async (req, res) => {
    const id = req.params.id;
    await Posts.deletePost(id, (deleteErr, data) => {
        if(deleteErr) return res.status(500).send({message: "Error while deleting post", error: deleteErr})
        if(data.affectedRows == 0 && data.fieldCount == 0) return res.status(404).send({message: `Request not executed because resource not available following id: ${id}` })
        res.json({message: "Deleted successfully"})
    })
})

//* GET => get all posts
router.get('/getAllPosts', async (req, res) => {
    await Posts.getAllPosts((error, data) => {
        if(error) return res.status(500).send({message: "Error while getting users", error: error})
        if(data.length == 0) return res.status(404).send({message: 'Request not executed because data not available', found: false})
        res.json(data)
    })
})

//* GET => get all posts user created
router.get("/getMyPosts", auth, async (req, res) => {
    const user = req.user;
    await Posts.getUserPosts(user.id, (error, data) => {
        if(error) return res.status(500).send({message: 'Error getting user', error: error})
        if(data.length == 0) return res.status(404).send({message: 'Posts you created not found'})
        res.json(data)
    })
} )

//* GET => get post by its id
router.get("/getPost/:id", async (req, res) => {
    const id = req.params.id;
    await Posts.getPostById(id, (error, data) => {
        if(error) return res.status(500).send({message: "Error while getting post", error: error})
        if(data.length == 0) return res.status(404).send({message: `Post not found following id: ${id}`})
        res.json(data[0])
    })
})

//* GET => get posts by category id
router.get("/getCategoryPost/:id", async (req, res) => {
    const id = req.params.id;
    await Posts.getPostByCategoryId(id, (error, data) => {
        if(error) return res.status(500).send({message: "Error while getting post", error: error})
        if(data.length == 0) return res.status(404).send({message: `Post related to category not found following id: ${id}`})
        res.json(data)
    })
})
module.exports = router;
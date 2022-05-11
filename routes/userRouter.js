require('dotenv').config
const express = require('express')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const bcrypt = require('bcrypt')

//* MODELS
const User = require('../models/userModel')

const router = express.Router()
router.get('/', (req, res) => {
    res.send('user router')
})

//* POST => register new user
router.post('/register', async (req, res) => {
    if (!req.body) return res.status(400).send({message: "Content cannot be empty"})
    const hashedPassword = await bcrypt.hash(req.body.user_password, 10);
    req.body.user_password = hashedPassword;
    await User.registerUser(req.body, (err, data) => {
        if (err) return res.status(500).send({message: "Error while creating User", error: err})
        res.json(data)
    })

})

//* POST => login user into app
router.post('/login', async (req, res) => {
    if (!req.body) return res.status(400).send({message: 'Cannot be empty'})
    await User.loginUser(req.body, (err, data) => {
        if (err) return res.status(500).send({message: 'Error while logging in', error: err})
        if (!data) return res.status(404).send({message: 'User not found'})
        const token = jwt.sign({id: data.user_id}, process.env.TOKEN_SECRET, {expiresIn: '1day'});
        res.json({user: data, token: token})
    })
})

//* PUT => updates user info by user id
router.put("/editUser/:id", auth, async (req, res) => {
    const id = req.params.id;
    await User.editUser({user_id: id, ...req.body}, (editErr, data) => {
        if(editErr) return res.status(500).send({message: 'Error while editing user', error: editErr})
        if(data.fieldCount == 0 && data.affectedRows == 0) return res.status(404).send({message: `Editing user not found following id ${id}`})
        res.json({message: "User info edited successfully", user: data})
    } )
})

//* DELETE => deletes user from database
router.delete("/deleteUser/:id", auth, async (req, res) => {
    const id = req.params.id;
    await User.deleteUser(id, (deleteErr, data) => {
        if(deleteErr) return res.status(500).send({message: "Error while deleting user", error: deleteErr})
        if(data.fieldCount == 0 && data.affectedRows == 0) return res.status(404).send({message: `User not found following id: ${id}`})
        res.json({message: "User deleted successfully"})
    })
})

module.exports = router
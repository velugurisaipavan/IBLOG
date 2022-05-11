require('dotenv').config()
const jwt = require('jsonwebtoken')

const userAuthentication = async (req, res, next) => {
    const token = req.headers?.authorization?.replace('Bearer ', '')
    if(!token) return res.sendStatus(401)
    await jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user;
        next()
    })

}

module.exports = userAuthentication;
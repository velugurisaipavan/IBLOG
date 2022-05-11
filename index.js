const express = require('express')
const app = express();
const path = require('path')
const PORT = process.env.PORT || 3000
require("dotenv").config()
//* ROUTERS
const userRouter = require('./routes/userRouter')
const postRouter = require('./routes/postRouter')
const categoryRouter = require('./routes/categoryRouter')
const commentRouter = require("./routes/commentRouter")

//* USE METHOD
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use("/onepost/:id", express.static(__dirname + "/public"))
app.use("/dashboard", express.static(__dirname + "/public"))
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/category", categoryRouter)
app.use("/comment", commentRouter)


//* CORS CONFIGURATION
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', "/views", "/index.html"))
})

app.get("/signUp", (req, res) => {
    res.sendFile(path.join(__dirname, "/public", "/views", "/signUp.html"))
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "/public", "/views", "/login.html"))
})

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "/public", "/views", "/dashboard.html"))
})

app.get("/onepost/:post_id", (req, res) => {
    res.sendFile(path.join(__dirname, "/public", "/views", "/onepost.html"))
})
//Listening port
app.listen(PORT, () => {
    console.log('App running on ' + PORT)
})
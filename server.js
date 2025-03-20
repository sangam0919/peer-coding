// npm init -y
// npm i express ejs mysql2 jsonwebtoken dotenv bcrypt multer
require('dotenv').config();
const express = require("express");
const path = require("path");
const userRouter = require("./routers/login.router")


const app = express();
app.set ("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(userRouter);

app.listen(3000,(req,res)=> {
    console.log("server on");
})
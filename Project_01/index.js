const express = require("express");
const userRouter = require("./routes/user");
const {connectMongoDb} = require("./connection");
const{logReqRes} = require("./middlewares")


const app = express();
const PORT = 8000;

//Connection
connectMongoDb("mongodb://127.0.0.1:27017/youtube-app-1").then(()=>
console.log("MongoDb Connected!"));


// MiddleWare -- Plugin
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

//Routes
app.use("/api/user",userRouter);

app.listen(PORT, () => {
    console.log(`Server Started at PORT ${PORT}`);
});
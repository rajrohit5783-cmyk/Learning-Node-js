const mongoose = require("mongoose");
// ===============================
// MongoDB Connection
// ===============================

 async function connectMongoDb(url){
    return mongoose
    .connect(url);
}


module.exports = {
    connectMongoDb,
}
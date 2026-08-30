const { captureRejectionSymbol } = require("events");
const fs = require("fs");


// //Sync... 
// // fs.writeFileSync('./text.txt', 'Hey There');


// //Async

// fs.writeFile("./text.txt", "Hello World Async", (err) => { }
// );


// const result = fs.readFileSync('./contacts.txt', "utf-8")
// console.log(result);

fs.readFile('./contacts.txt' , "utf-8", (err,result) => {
    if (err) {
        console.log("Error", err);
    }
    else{
        console.log(result);
    }
});
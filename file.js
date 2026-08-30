// const { captureRejectionSymbol } = require("events");
const fs = require("fs");
const os = require("os");


console.log(os.cpus().lenth);



//Sync...  
// fs.writeFileSync('./text.txt', 'Hey There');


//Async

fs.writeFile("./text.txt", "Hello World Async", (err) => { }
);


// const result = fs.readFileSync('./contacts.txt', "utf-8")
// console.log(result);

// fs.readFile('./contacts.txt' , "utf-8", (err,result) => {
//     if (err) {
//         console.log("Error", err);
//     }
//     else{
//         console.log(result);
//     }
// // });
// fs.appendFileSync("./text.txt",`${Date.now()} hey there\n`);

// // fs.copyFileSync('./text.txt','./copy.txt' );

// // fs.unlinkSync('./copy.txt');

// console.log(fs.statSync('./text.txt'));

// fs.mkdirSync("my-docss/a/b", {recursive: true});


console.log('1');

//Blocking..

// const result = fs.readFileSync('./contacts.txt', 'utf-8');
// console.log(result);

// console.log('2');


//non-Blocking..

fs.readFile('./contacts.txt','utf-8', (err, result) => {
    console.log(result);


})

console.log('2');
console.log('3');
console.log('4');


//Default Thread pool size = 4


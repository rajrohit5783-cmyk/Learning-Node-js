// console.log(arguments);
// console.log(require('module').wrapper);


//modules.exports
const C = require('./test-modules-1');
const calc1 = new C();
console.log(calc1.add(2,5));

//exports
// const calc2 = require('./test-moduls-2');
const { add,multiply,divide } = require('./test-modules-2');
console.log(multiply(2,5));


//Caching
require('./test-modules-3')();
require('./test-modules-3')();
require('./test-modules-3')();

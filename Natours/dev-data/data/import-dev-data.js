const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModels');


 
 dotenv.config({ path: './config.env' });
 

 
 const DB = process.env.DATABASE.replace(
   '<PASSWORD>',
   process.env.DATABASE_PASSWORD
 );
 
 //For the Atlas One (Server)
 mongoose
   .connect(DB)
   .then(() => console.log('MongoDB connected successfully!'))
   .catch((err) => console.error('MongoDB error:', err));
 
//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));


// IMPORT DATA IN DB
const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data Successfully loaded');
    }catch(err){
        console.log(err);
    }
    process.exit();
};

//DELETE ALL DATA FROM DB
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('Data Successfully deleted');
    }catch (err){
        console.log(err);
    }
    process.exit();
};


if(process.argv[2] === '--import'){
    importData();


}else if(process.argv[2] === '--delete'){
    deleteData();
}
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

//For the Atlas One (Server)
mongoose
  .connect(DB)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.error('MongoDB error:', err));


//For the LOCAL DB
// mongoose
//   .connect(process.env.DATABASE_LOCAL)
//   .then(() => console.log('MongoDB connected successfully!'))
//   .catch((err) => console.error('MongoDB error:', err)); 


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App runnig on port ${port}...`);
});

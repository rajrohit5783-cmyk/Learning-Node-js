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

const tourSchema = new mongoose.Schema({
  //Basic one
  // name: String,
  // rating: Number,
  // price: Number

  //Advanced Or Better Way
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  // rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('Error!!!: ', err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App runnig on port ${port}...`);
});

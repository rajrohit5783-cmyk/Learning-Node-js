const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  //Basic one
  // name: String,
  // rating: Number,
  // price: Number

  //Advanced Or Better Way
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
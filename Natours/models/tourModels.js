const mongoose = require('mongoose');
const { kMaxLength } = require('node:buffer');
const slugify = require('slugify');
const validator = require('validator')

const tourSchema = new mongoose.Schema(
  {
    //Basic one
    // name: String,
    // rating: Number,
    // price: Number

    //Advanced Or Better Way
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal to 40 charachters'],
      minLength: [10, 'A tour name must have more or equal to 10 charachters'],
      // validate: [validator.isAlpha, 'Tour name must only contain Characters ']
    },
    slug: String,

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either : easy,medium, difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only points to current doc on NEW document creation not on updation
          return val < this.price;
        },

        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },

  {
    // iske bare me padho isko kyu add kiya and how can we add in the schema
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
//we can't use arrow fn in the virtual property  as we can't use this in arrpow fn and we have to use get() in virtual property.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

// tourSchema.pre('save', function(){
//   console.log("will save document..");

// });

// tourSchema.post('save', function(doc,next){
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function () {
  // tourSchema.pre('find', function () {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
});

tourSchema.post(/^find/, function (docs) {
  console.log(`query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

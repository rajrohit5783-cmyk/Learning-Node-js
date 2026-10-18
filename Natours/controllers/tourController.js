// const fs = require('fs');
const { join } = require('node:path');
const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFileds()
      .paginate();
    const tours = await features.query;

    console.log(
      tours.map((tour) => ({
        id: tour._id,
        name: tour.name,
      })),
    );

    //SEND RESPONSE
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findone({_id: req.params.id}); Same as above
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    // const newTour = new Tour({});
    // newTour.save()
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        // tour: tour
        tour, //both are same due to ES6 we no longer have to write when the name of property and value is same
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

//Aggregation Pipeline

exports.getTourStats = async (req,res)=> {
  try{
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5}}
      },
      {
        $group: { 
          _id: {$toUpper: '$difficulty'},
          numTours: {$sum: 1},
          numRatings: {$sum: '$ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage'},
          avgPrice: { $avg: '$price'},
          minPrice: { $min: '$price'},
          maxprice: { $max: '$price'},
        }
       
      },
        {
        $sort: { avgPrice: 1 }
        }
        // {
        //   $match: {_id: { $ne: 'EASY'}}
        // }
    ]);
      res.status(200).json({
        status: 'success',
        data: {
          stats
        }
      });
  } catch(err){
    res.status(404).json({
      status: 'Fail',
      message: err.message
    });
  }
};


exports.getMonthlyPlan = async (req,res) => {
  try{
    const year = req.params.year* 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          }
        }
      },
      {
      $group: {
        _id: { $month: '$startDates'},
        numTourStarts: {$sum: 1},
        tours: {$push:'$name'}
       }
      },
      {
        $addFields: { month: '$_id'}
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1}
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
          plan
        }
      });
  }catch(err){
    res.status(404).json({
      status: 'Fail',
      message: err.message
    });
  }
};

//BEFORE REFACTORING

// const fs = require('fs');
// const { join } = require('node:path');
// const Tour = require('./../models/tourModels');

// exports.aliasTopTours = (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//   next();
// };
// // const tours = JSON.parse(
// //   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// // );

// // exports.checkBody = (req, res, next) => {
// //   if (!req.body.name || !req.body.price) {
// //     return res.status(400).json({
// //       status: 'fail',
// //       message: 'Missing name or price',
//  //     });
// //   }
// //   next();
// // };

// exports.getAllTours = async (req, res) => {
//   try {
//     console.log(req.query);
//     //BUILD QUERY
//     // 1A) Filtering
//     const queryObj = { ...req.query }; //Cusotm Query filters
//     const excludedFields = ['page', 'sort', 'limit', 'fields']; //will ignore these queries
//     excludedFields.forEach((el) => delete queryObj[el]);

//     console.log(req.query, queryObj);

//     //WAYS TO WRITE A QUERY
//     // const tours = await Tour.find(req.query);

//     //1B) Advance Filtering
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     console.log(JSON.parse(queryStr));

//     // { difficulty: 'easy', duration: {$gte:  5} }
//     // { difficulty: 'easy', duration: { gte: '5' }
//     //gte, gt, lte, lt

//     // const tours = await Tour.find({
//     //   duration: 5,
//     //   difficulty: 'easy'
//     // });

//     // const tours = await Tour.find()
//     //   .where('duration')
//     //   .equals(5)
//     //   .where('difficulty')
//     //   .equals('easy');

//     let query = Tour.find(JSON.parse(queryStr)); //we should not use await here we can later use await so that we can use functions like sort by chaining in ths

//     //2) Sorting
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');
//       console.log(sortBy);
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort('-createdAt');
//     }

//     //3) Field Limiting
//     if (req.query.fields) {
//       const fields = req.query.fields.split(',').join(' ');
//       query = query.select(fields);
//     } else {
//       query = query.select('-__v'); // - is used for excluding
//     }

//     // 4) Pagination
//     // page=2&limit=10, 1-10 : page 1, 11-20: page 2, 21-30: page 3
//     const page = req.query.page * 1 || 1; // way of wriiting default value in Js and 1 after || is used to set the default page to 1
//     const limit = req.query.limit * 1 || 100;
//     const skip = (page - 1) * limit;

//     query = query.sort({ _id: 1 }).skip(skip).limit(limit);

//     if (req.query.page) {
//       const numTours = await Tour.countDocuments();
//       if (skip >= numTours) {
//         throw new Error('This page does not exist');
//       }
//     }

//     // EXECUTE QUERY
//     const tours = await query;

//     console.log(
//       tours.map((tour) => ({
//         id: tour._id,
//         name: tour.name,
//       })),
//     );

//     //SEND RESPONSE
//     res.status(200).json({
//       status: 'Success',
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'Fail',
//       message: err.message,
//     });
//   }
// };

// exports.getTour = async (req, res) => {
//   try {
//     const tour = await Tour.findById(req.params.id);
//     //Tour.findone({_id: req.params.id}); Same as above
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'Fail',
//       message: err.message,
//     });
//   }
// };

// exports.createTour = async (req, res) => {
//   try {
//     const newTour = await Tour.create(req.body);
//     // const newTour = new Tour({});
//     // newTour.save()
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err.message,
//     });
//   }
// };

// exports.updateTour = async (req, res) => {
//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: 'success',
//       data: {
//         // tour: tour
//         tour, //both are same due to ES6 we no longer have to write when the name of property and value is same
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err.message,
//     });
//   }
// };

// exports.deleteTour = async (req, res) => {
//   try {
//     await Tour.findByIdAndDelete(req.params.id);

//     res.status(204).json({
//       status: 'Success',
//       data: null,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'Fail',
//       message: err.message,
//     });
//   }
// };
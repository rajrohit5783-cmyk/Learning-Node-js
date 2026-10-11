// const fs = require('fs');
const Tour = require('./../models/tourModels');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );


// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try{
    const tours = await Tour.find();

    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours
      }
    });
  }catch(err){
    res.status(404).json({
      status: 'Fail',
      message: err

    });
  }
};

exports.getTour = async (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id);
    //Tour.findone({_id: req.params.id}); Same as above
  } catch(err){
     res.status(404).json({
      status: 'Fail',
      message: err

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
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data Sent!'
    });
  }
};



exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'Success'
    // data: {
    //   tour: '<Updated tour here',
    // },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: null
  });
};

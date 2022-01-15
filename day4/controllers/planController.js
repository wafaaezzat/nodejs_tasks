const plan = require('./../models/planModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopplans = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-nameUsers,price';
  req.query.fields = 'name,users,price';
  next();
};

exports.getAllplans = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(plan.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const plans = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: plans.length,
    data: {
      plans
    }
  });
});

exports.getplan = catchAsync(async (req, res, next) => {
  const plan = await plan.findById(req.params.id);
  // plan.findOne({ _id: req.params.id })

  if (!plan) {
    return next(new AppError('No plan found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

exports.createplan = catchAsync(async (req, res, next) => {
  const newplan = await plan.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      plan: newplan
    }
  });
});

exports.updateplan = catchAsync(async (req, res, next) => {
  const plan = await plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!plan) {
    return next(new AppError('No plan found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

exports.deleteplan = catchAsync(async (req, res, next) => {
  const plan = await plan.findByIdAndDelete(req.params.id);

  if (!plan) {
    return next(new AppError('No plan found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getplanStats = catchAsync(async (req, res, next) => {
  const stats = await plan.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$name' },
        numplans: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }

  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {handlerFactory.js
  const year = req.params.year * 1; // 2022

  const plan = await plan.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numplanStarts: { $sum: 1 },
        plans: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numplanStarts: -1 }
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
});

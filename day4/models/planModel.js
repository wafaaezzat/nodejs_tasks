const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A plan must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A plan name must have less or equal then 40 characters'],
      minlength: [10, 'A plan name must have more or equal then 10 characters']
    },
    
      users: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: [true, 'A plan must have a price']
    },
    subscription: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

planSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
planSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});


planSchema.pre(/^find/, function(next) {
  this.find({ secretplan: { $ne: true } });

  this.start = Date.now();
  next();
});

planSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

planSchema.pre('save', async function(next) {
  const subscribtionPromises = this.subscription.map(async id => await User.findById(id));
  this.subscribtion = await Promise.all(subscribtionPromises);
  next();
});

// AGGREGATION MIDDLEWARE
planSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretplan: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const plan = mongoose.model('plan', planSchema);

module.exports = plan;

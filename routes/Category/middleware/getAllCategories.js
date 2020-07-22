const Category = require('../model/Category');

const getAllCategories = (req, res, next) => {
  Category.find({}, (err, categories) => {
    if (err) return next(err);

    res.locals.categories = categories;
    next();
  });
};

module.exports = getAllCategories;

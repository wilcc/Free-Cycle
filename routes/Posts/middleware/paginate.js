const Post = require('../../Posts/models/Post')


module.exports={ paginate : (req, res, next) => {
    const perPage = 6;
    const page = req.params.pageNumber;
    Post.find()
      .skip(perPage * (page - 1))
      .limit(perPage)
      .populate('owner')
      .exec((err, foundPost) => {
        if (err) return next(err);
        Post.countDocuments().exec((err, count) => {
          if (err) return next(err);
          return res.render('main/allPost', {
            foundPost,
            pages: Math.ceil(count / perPage),
            page: Number(page)
          });
        });
      });
  }
}
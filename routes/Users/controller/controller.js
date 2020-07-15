const User = require('../models/User');

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) return res.status(401).json({ msg: 'User Already Exists' });

      user = await new User({ profile: { name }, email, password });
      await user.save();
      await req.login(user, (err) => {
        if (err) {
          return res.status(400).json({ confirmation: false, message: err });
        } else {
          res.redirect(301, '/api/posts/get-all');
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'failed', error });
    }
  },
};

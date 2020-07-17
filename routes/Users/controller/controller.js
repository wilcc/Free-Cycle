const User = require('../models/User');
const bcrypt =require('bcryptjs')

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
          return res.redirect(301, '/api/posts/get-all');
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'failed', error });
    }
  },
  updateProfile: (params, id) => {
    return new Promise((resolve, reject) => {
      User.findById(id)
        .then((user) => {
          if (params.name) user.profile.name = params.name;
          if (params.email) user.email = params.email;
          if (params.address) user.address = params.address;
          return user;
        })
        .then((user) => {
          user
            .save()
            .then((user) => {
              // return res.json({ user });
              resolve(user);
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  },
  updatePassword: (params, id) => {
    return new Promise((resolve, reject) => {
      User.findById(id)
        .then((user) => {
          const { oldPassword, newPassword, repeatNewPassword } = params;
          if (!oldPassword || !newPassword || !repeatNewPassword) {
            reject('All Inputs Not Filled');
          } else if (newPassword !== repeatNewPassword) {
            reject('New Passwords Do Not Match');
          } else {
            bcrypt
              .compare(oldPassword, user.password)
              .then((match) => {
                if (!match) {
                  reject('Old Password Does Not Match');
                } else {
                  user.password = newPassword;
                  user
                    .save()
                    .then((user) => {
                      resolve(user);
                    })
                    .catch((err) => {
                      reject('New Password Did Not Save');
                    });
                }
              })
              .catch((err) => {
                reject('Cannot Find User');
              });
          }
        })
        .catch((err) => {
          console.log('Server Error'), reject(err);
        });
    });
  },
  logout: (req, res) => {
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: null
    });
    req.session.destroy();
    return res.redirect('/api/users/login');
  }
};

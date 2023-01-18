const { User } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const flash = require("connect-flash");

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (user) {
        req.flash('message', 'email is already in use');
        return res.redirect('/sign-up');
      }
      const newUser = await User.create({
        username: username,
        email: email,
        password: password,
        token: crypto.randomBytes(256).toString("base64"),
        firstName: null,
        lastName: null,
        image: null,
        location: null,
      });

      if (newUser) {
        const token = jwt.sign(
          {
            id: newUser.id,
            email: newUser.email,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("user_info", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        newUser.token = token;
        res
          .header("user_info", token)
          .send({ success: true, msg: "successfully registered in", data: newUser });
      }
    } catch (e) {
      res.redirect('/chat');
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      if (!user) {
        res.json({ success: false, msg: "no user with that email" });
      }

      if (user.password !== password || user.email !== email) {
        res.json({ success: false, msg: "incorrect email or password" });
      }

      if (user && user.password === password) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            token: user.token,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("user_info", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        user.token = token;
        res
          .header("user_info", token)
          .redirect('/chat');

      }
    } catch (e) {
      res.json("something went wrong");
    }
  },

  signOut: async (req, res, next) => {

    res.clearCookie('connect.sid');
    res.clearCookie('user_info');
    res.redirect('/')

  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email });
      if (user) {
        res.redirect('/reset-password');
      } else {
        res.redirect('/forgot-password')
      }

    } catch (r) {
      res.json("something went wrong");
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const email = req.params.email;
      const { oldPassword, newPassword } = req.body;
      const user = await User.findOne({ email: email });
      if (user && oldPassword === user.password) {
        user.password = newPassword;
        await user.save();
      }
      res.redirect('/')
    } catch (e) {
      res.json("something went wrong");
    }
  },
};

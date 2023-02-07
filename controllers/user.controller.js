import { User } from "../model/user.model.js";
import { Rooms } from "../model/rooms.model.js"
import jwt from "jsonwebtoken"
import { randomBytes } from "crypto";
import { SocketIOManager } from "../app.js";
import Cookies from "js-cookie";
// ========================================== IMPORT MODULES AND PACKAGES


// USER CRUD
// =============================================================== START
export async function signUp(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email: email }); // ======= FINDING CURRENT USER
    if (user) {
      req.flash('message', 'email is already in use');
      return res.redirect('/sign-up');
    }
    const newUser = await User.create({  // ======= CREATING NEW USER
      username: username,
      email: email,
      password: password,
      token: randomBytes(256).toString("base64"),
      firstName: null,
      lastName: null,
      image: null,
      location: null,
    });

    if (newUser) {           // ======= CREATING JWT TOKEN

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
      res.cookie("user_info", token, {  // ======= SAVING TOKEN IN COOKIE
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
}
// =============================================================== SIGNING UP USER
export async function signIn(req, res, next) {
  try {
    const email = req.query.email;
    const password = req.query.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.redirect("/chat")
    }
    if (user.password !== password || user.email !== email) {
      res.redirect("/chat")
    }
    if (user && user.password === password) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
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
        .send({ userDetails: user });

    }
  } catch (e) {
    res.json("something went wrong");
  }
}
// =============================================================== SIGNING IN USER
export async function signOut(req, res, next) {

  const id = req.user.id;
  const user = await User.findById(id);
  Cookies.remove('connect.sid');
  Cookies.remove('user_info');
  res.redirect('/');

}
// =============================================================== SIGNING OUT USER
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      res.redirect('/reset-password');
    } else {
      res.redirect('/forgot-password');
    }

  } catch (r) {
    res.json("something went wrong");
  }
}
// =============================================================== FORGOT PASSWORD TO RESET NEW PASSWORD
export async function resetPassword(req, res, next) {
  try {
    const email = req.params.email;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email: email });
    if (user && oldPassword === user.password) {
      user.password = newPassword;
      await user.save();
    }
    res.redirect('/');
  } catch (e) {
    res.json("something went wrong");
  }
}
// =============================================================== RESETTING NEW PASSWORD FOR CURRENT USER
// =============================================================== STOP

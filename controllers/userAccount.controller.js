const { User } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports = {
  myAccount: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const image = req.file.path
      const { firstName, lastName, location } = req.body;
      const user = await User.findByIdAndUpdate(userId, {
        firstName: firstName,
        lastName: lastName,
        location: location,
        image: image,
      });
      if (user) {
        res.json({ success: true, msg: 'account updated successfully' })
      }
    } catch (e) {
      res.json({ msg: "something went wrong" });
    }
  },
};

const jwt = require("jsonwebtoken");

module.exports = {
  Token: async (req, res, next) => {
    try {
      const token = req.cookies.user_info;
      if (token) {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode;
        next();
      } else {
        return res.json({ success: false, msg: "invalid token" });
      }
    } catch (e) {
      res.json({ success: false, msg: "unauthorized user" });
    }
  },
};

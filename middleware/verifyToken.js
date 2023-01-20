import { verify } from "jsonwebtoken";
// ======================================================================== IMPORTING MODULES AND PACKAGES

// VERIFYING TOKEN 
// ================================================ START
export async function Token(req, res, next) {
  try {
    const token = req.cookies.user_info;
    if (token) {
      const decode = verify(token, process.env.SECRET_KEY); // DECODING TOKEN
      req.user = decode; // SAVING USER INFO IN TOKEN
      next();
    } else {
      return res.json({ success: false, msg: "invalid token" });
    }
  } catch (e) {
    res.json({ success: false, msg: "unauthorized user" });
  }
}
// ================================================ STOP

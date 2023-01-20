import { User } from "../model/user.model.js";
// ========================================== IMPORT MODULES AND PACKAGES

// MY ACCOUNT CRUD
// ========================================== START
export async function myAccount(req, res, next) {
  try {
    const userId = req.user.id;
    const image = req.file.path;
    const { firstName, lastName, location } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      firstName: firstName,
      lastName: lastName,
      location: location,
      image: image,
    });
    if (user) {
      res.json({ success: true, msg: 'account updated successfully' });
    }
  } catch (e) {
    res.json({ msg: "something went wrong" });
  }
}
// ========================================== STOP

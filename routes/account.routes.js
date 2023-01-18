const { myAccount } = require("../controllers/userAccount.controller");
const { Token } = require("../middleware/verifyToken");
const multer = require("multer");
const mimeTypesFilter = require('@meanie/multer-mime-types-filter');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/user")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({ storage: storage, fileFilter: mimeTypesFilter(mimeTypes) });
const router = require("express").Router();

router.post("/my-account", Token, upload.single('image'), myAccount);

module.exports = router;

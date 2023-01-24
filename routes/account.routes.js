import { myAccount } from "../controllers/userAccount.controller.js";
import { Token } from "../middleware/verifyToken.js";
import multer, { diskStorage } from "multer";
import mimeTypesFilter from '@meanie/multer-mime-types-filter';
import path from 'path';
import { Router } from "express";
const accountRoutes = Router();
// ======================================================================== IMPORTING MODULES AND PACKAGES


// =================================== START
// MULTER STORAGE
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/user") //============== FILE LOCATION
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)) //============== FILNAME
    }
})
const mimeTypes = ['image/jpeg', 'image/png', 'image/gif']; // FILE EXTENSIONS 
const upload = multer({ storage: storage, fileFilter: mimeTypesFilter(mimeTypes) }); // FILE UPLOAD FILTER
// ==============================================================================================================


accountRoutes.post("/my-account", Token, upload.single('image'), myAccount);
// =================================== STOP


export default accountRoutes;  //============================== EXPORTING MODULE

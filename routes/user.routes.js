import { Router } from "express";
import { signUp, signIn, signOut } from "../controllers/user.controller.js";
const userRoutes = Router();
// ======================================================================== IMPORTING MODULES AND PACKAGES

// =================================== START
userRoutes.post("/sign-in", signIn); //========================= SIGN IN
userRoutes.post("/sign-up", signUp); //========================= SIGN UP
userRoutes.get("/sign-out", signOut) //========================= SIGN OUT
// =================================== STOP


export default userRoutes; //============================== EXPORTING MODULE

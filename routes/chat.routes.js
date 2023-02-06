import { Router } from "express";
import { startNewChat } from "../controllers/startNewChat.controller.js";
const chatRoutes = Router();
// ======================================================================== IMPORTING MODULES AND PACKAGES

// =================================== START
chatRoutes.get("/start-new-chat", startNewChat); //========================= GET ROOM DETAILS
// =================================== STOP


export default chatRoutes; //============================== EXPORTING MODULE

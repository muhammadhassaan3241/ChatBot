import { Router } from "express";
import { getRoomDetails } from "../controllers/getRoomDetails.controller.js";
const roomRoutes = Router();
// ======================================================================== IMPORTING MODULES AND PACKAGES

// =================================== START
roomRoutes.get("/get-room-details", getRoomDetails); //========================= GET ROOM DETAILS
// =================================== STOP


export default roomRoutes; //============================== EXPORTING MODULE

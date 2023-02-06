import { Schema, model } from "mongoose";
// ======================================================================== IMPORTING MODULES AND PACKAGES

// MONGOOSE USER MODEL
// ===================================== START
const userSchema = new Schema({    // =========== CREATING SCHEMA FOR USER  
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  location: {
    type: String,
  },
  image: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
  },
  token: {
    type: String,
    unique: true,
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  socket:{
    type:String
  }
});
// ===================================== STOP


export const User = model("User", userSchema);   // ========== EXPORTING MODEL

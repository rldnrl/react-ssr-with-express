import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./users/userSlice";

const rootReducer = combineReducers({
  users: userReducer,
});

export default rootReducer;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import rideReducer from "../features/rideSlice";
import requestReducer from "../features/requestSlice";
import reviewReducer from "../features/reviewSlice";
import userReducer from "../features/userSlice";
import notificationReducer from "../features/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rides: rideReducer,
    requests: requestReducer,
    reviews: reviewReducer,
    user: userReducer,
    notifications: notificationReducer,
  }
});
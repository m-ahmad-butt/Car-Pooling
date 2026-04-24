import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import rideReducer from "../features/rideSlice";
import bookingReducer from "../features/requestSlice";
import reviewReducer from "../features/reviewSlice";
import userReducer from "../features/userSlice";
import notificationReducer from "../features/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rides: rideReducer,
    bookings: bookingReducer,
    reviews: reviewReducer,
    user: userReducer,
    notifications: notificationReducer,
  }
});
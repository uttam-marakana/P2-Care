import React from "react";
import { Navigate, Outlet } from "react-router-dom";

//
//   import PrivateRoute from "./components/auth/PrivateRoute";
//
//   <Route element={<PrivateRoute />}>
//     <Route path="/patient-details" element={<Patients_Details />} />
//   </Route>
//
// The component checks for an auth token in localStorage.
// Replace this logic with your real auth state (e.g. Redux selector) as needed.

const PrivateRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

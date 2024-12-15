import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "../Pages/Auth/auth";
import PrivateRoute from "./PrivateRoutes";
import DashbordLayout from "../Pages/DashBoardLayout/DashBoardLayout";
import QuizContainer from "../Pages/QuizQuestionsContainer/QuizQuestionsContainer";

const Routing = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/auth"
          element={token ? <Navigate to="/dashboard" /> : <Auth />}
        />
        <Route path="/quiz/:id" element={<QuizContainer />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashbordLayout />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default Routing;

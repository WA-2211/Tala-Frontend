import { useState } from "react";
import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Recommendation from "./pages/place/Recommendation";
import BrowsePlaces from './pages/place/Allplaces'
import PlaceDetails from "./pages/place/PlaceDetails";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { getCurrentUser, logout } from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/place" element={<BrowsePlaces />}/>
        <Route path="/place/:placeId" element={<PlaceDetails />}/>
        <Route path="/recommended" element={<ProtectedRoute><Recommendation /></ProtectedRoute>} />

      </Routes>
    </div>
  );
}

export default App;

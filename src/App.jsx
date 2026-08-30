import { useState } from "react";
import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Recommendation from "./pages/place/Recommendation";
import BrowsePlaces from './pages/place/Allplaces'
import PlaceDetails from "./pages/place/PlaceDetails";
import VisitPlace from "./pages/visit/VisitPlace";
import FavoritePlaces from "./pages/favorite/FavoritePlaces";
import AllPlans from "./pages/plan/AllPlans";
import PlanDetails from "./pages/plan/PlanDetails";
import PublicInvite from "./pages/invite/PublicInvite";
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
        <Route path="/plan/invite/:inviteLink" element={<PublicInvite />}/>
        <Route path="/place/:placeId" element={<PlaceDetails />}/>
        <Route path="/recommended" element={<ProtectedRoute><Recommendation /></ProtectedRoute>} />
        <Route path="/visit" element={<ProtectedRoute><VisitPlace/></ProtectedRoute>}/>
        <Route path="/favorite" element={<ProtectedRoute><FavoritePlaces/></ProtectedRoute>}/>
        <Route path="/plan" element={<ProtectedRoute><AllPlans/></ProtectedRoute>}/>
        <Route path="/plan/:planId" element={<ProtectedRoute><PlanDetails/></ProtectedRoute>}/>
      </Routes>
    </div>
  );
}

export default App;

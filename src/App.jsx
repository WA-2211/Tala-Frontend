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
import CreateInvite from "./pages/invite/CreateInvite";
import MyInvites from "./pages/invite/MyInvites";
import CreatePlace from "./pages/admin/CreatePlace";
import EditPlace from "./pages/admin/EditPlace";
import ManagePlaces from "./pages/admin/ManagePlaces";
import { useEffect } from "react";
import { getCurrentUser, logout } from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute";
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
        <Route path="/plan/:planId/invite" element={<ProtectedRoute><CreateInvite/></ProtectedRoute>}/>
        <Route path="/invite" element={<ProtectedRoute><MyInvites/></ProtectedRoute>}/>
        <Route path="/admin/place" element={<AdminRoute><ManagePlaces/></AdminRoute>}/>
        <Route path="/admin/place/create" element={<AdminRoute><CreatePlace/></AdminRoute>}/>
        <Route path="/admin/place/:placeId/edit" element={<AdminRoute><EditPlace/></AdminRoute>}/>

      </Routes>
    </div>
  );
}

export default App;

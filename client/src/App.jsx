// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home        from "./pages/home/Home";
import Hotels      from "./pages/hotels/Hotels";
import HotelDetail from "./pages/hotelDetail/HotelDetail";
import Login       from "./pages/login/Login";
import Register    from "./pages/register/Register";
import Profile     from "./pages/profile/Profile";
import Admin       from "./pages/admin/Admin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />}        />
        <Route path="/hotels"     element={<Hotels />}      />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/login"      element={<Login />}       />
        <Route path="/register"   element={<Register />}    />
        <Route path="/profile"    element={<Profile />}     />
        <Route path="/admin"      element={<Admin />}       />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

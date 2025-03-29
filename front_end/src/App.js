import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import Maps from "./pages/Maps";
import Arsenal from "./pages/Arsenal";
import Specs from "./pages/Specs";
import Shop from "./pages/shop";
import Login from "./pages/Login";
import CustomCursor from "./CustomCursor";
import "./index.css"; // Global styles, including custom cursor styles

function App() {
  return (
    <div>
      {/* Render the custom cursor */}
      <CustomCursor />
      <Router>
        <div className="container-fluid text-white bg-dark">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/arsenal" element={<Arsenal />} />
            <Route path="/specs" element={<Specs />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

import { Menu } from "./menu"
import { Footer } from "./footer"
import { Home } from "./home"
import { useNavigate } from "react-router-dom";
import React from "react";

export default function LayoutDashboard() {

  const navigate = useNavigate();


  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfc]">
      <Menu />
      <Home onClick={() => navigate('/note')}/>
      <Footer />
    </div>
  );
}


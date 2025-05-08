import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import IdeaBoard from "./pages/IdeaBoard/IdeaBoard";
import "./App.scss";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IdeaBoard />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App; 
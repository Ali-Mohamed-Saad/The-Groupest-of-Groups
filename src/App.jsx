import Sidebar from "./shared/Sidebar";
import Dashboard from "./components/Dashboard";
import Board from "./components/Board";
import AI from "./components/AI";
import Team from "./components/Team";
import Settings from "./components/Settings";
import { ThemeProvider } from "./context/ThemeContext";

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <StrictMode>
            <ThemeProvider>
                <BrowserRouter>
                    <div className="d-flex overflow-hidden vh-100">
                        <Sidebar />
                        <div className="routes d-flex flex-grow-1 flex-column overflow-hidden h-100">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/Board" element={<Board />} />
                                <Route path="/ai" element={<AI />} />
                                <Route path="/team" element={<Team />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                        </div>
                    </div>
                </BrowserRouter>
            </ThemeProvider>
        </StrictMode>
    );
}

export default App;
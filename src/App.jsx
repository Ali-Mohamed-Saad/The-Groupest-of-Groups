import Sidebar from "./shared/Sidebar";
import Dashboard from "./components/Dashboard";
import Board from "./components/Board";
import AI from "./components/AI";
import Team from "./components/Team";
import Settings from "./components/Settings";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import MainLayout from "./shared/MainLayout";

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap-icons/font/bootstrap-icons.css'
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <StrictMode>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login></Login>}></Route>
                        <Route path="/signup" element={<SignUp></SignUp>}></Route>
                        <Route element={<MainLayout></MainLayout>}>
                            <Route path="/" element={<Dashboard></Dashboard>}></Route>
                            <Route path="/Board" element={<Board></Board>}></Route>
                            <Route path="/ai" element={<AI></AI>}></Route>
                            <Route path="/team" element={<Team></Team>}></Route>
                            <Route path="/settings" element={<Settings></Settings>}></Route>
                        </Route>
                     </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </StrictMode>
    );
}

export default App;
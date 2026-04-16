import Sidebar from "./shared/Sidebar"
import Dashboard from "./components/Dashboard";
import Board from "./components/Board";
import AI from "./components/AI";
import Team from "./components/Team";
import Settings from "./components/Settings";

import './App.css'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { StrictMode } from "react";
import { BrowserRouter, Routes , Route } from "react-router-dom";

function App() {
      return(
        <>
                <StrictMode>
                        <BrowserRouter>
                                <div className="d-flex">
                                        <Sidebar/>
                                        <div className="flex-grow-1">
                                                <Routes>
                                                        <Route path="/" element={<Dashboard></Dashboard>}></Route>
                                                        <Route path="/Board" element={<Board></Board>}></Route>
                                                        <Route path="/ai" element={<AI></AI>}></Route>
                                                        <Route path="/team" element={<Team></Team>}></Route>
                                                        <Route path="/settings" element={<Settings></Settings>}></Route>
                                                </Routes>
                                        </div>
                                </div>
                        </BrowserRouter>
                </StrictMode>
        </>)
}

export default App

import { Link } from "react-router-dom"
import placeholder from "../assets/placeholder.png"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

import './Sidebar.css'

function Sidebar() {
    const { activeTheme, toggleDarkLight } = useTheme();
    const { user, logout } = useAuth();

    return(
        <>
            <div className="d-flex flex-column justify-content-between sidebar h-100">
                
                <div>
                    <div className="d-flex align-items-center text-light m-3 mb-0">
                        <div className="bolt-bg mx-2">
                            <span className="material-symbols-outlined text-dark">bolt</span>
                        </div>
                        <div>
                            <h5 className="text-light mb-0 mt-2 title">AI-Sprint</h5>
                            <h6 className="version">v1.0.0</h6>
                        </div>
                    </div>
                    <hr/>
                    <ul className="d-flex flex-column gap-3 ps-3">
                        <Link to="/">
                            <div className="buttons">
                                <span className="material-symbols-outlined" >dashboard</span>
                                <span>Dashboard</span>
                            </div>
                        </Link>
                        <Link to="/board">
                            <div className="buttons">
                                <span className="material-symbols-outlined">view_kanban</span>
                                <span>Board</span>
                            </div>
                        </Link>
                        <Link to="/ai">
                            <div className="buttons">
                            <span className="material-symbols-outlined">star_shine</span>
                            <span>AI Generate</span>
                            </div>
                        </Link>
                        <Link to="/team">
                            <div className="buttons">
                                <span className="material-symbols-outlined">group</span>
                                <span>Team</span>
                            </div>
                        </Link>
                        <Link to="/settings">
                            <div className="buttons">
                                <span className="material-symbols-outlined">settings</span>
                                <span>Settings</span>
                            </div>
                        </Link>
                    </ul>
                </div>
                <div>
                    <hr />
                    <div className="ps-3">
                        <div className="buttons theme-toggle-btn" onClick={toggleDarkLight} style={{ cursor: "pointer" }}>
                             <span className="material-symbols-outlined">
                                {activeTheme.isDark ? "wb_sunny" : "dark_mode"}
                            </span>
                            <span>{activeTheme.isDark ? "Light Mode" : "Dark Mode"}</span>
                        </div>
                    </div>
                    <div className="px-3 d-flex justify-content-between align-items-center my-3">
                        <div className="d-flex align-items-center">
                            <img src={ placeholder} alt="" />
                            <span className="sidebar-email mx-2 text-truncate" style={{ maxWidth: "120px" }} title={user?.email || "example@gmail.com"}>
                                {user?.email || "example@gmail.com"}
                            </span>
                        </div>
                        <span 
                            className="material-symbols-outlined mb-2" 
                            onClick={logout} 
                            style={{ cursor: "pointer" }}
                            title="Sign Out"
                        >
                            exit_to_app
                        </span>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Sidebar
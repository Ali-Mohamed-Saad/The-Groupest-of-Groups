import { Link } from "react-router-dom"
import placeholder from "../assets/placeholder.png"
import Dashboard from "../components/Dashboard"
import Board from "../components/Board"
import AI from "../components/AI"
import Settings from "../components/Settings"
import Team from "../components/Team"

import './Sidebar.css'

function Sidebar() {
    return(
        <>
            <div className="d-flex flex-column justify-content-between sidebar min-vh-100">
                
                <div>
                    <div className="d-flex align-items-center text-light m-3 mb-0">
                        <div className="bolt-bg mx-2">
                            <span className="material-icons text-dark">bolt</span>
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
                                <span className="material-icons" >dashboard</span>
                                <span>Dashboard</span>
                            </div>
                        </Link>
                        <Link to="/board">
                            <div className="buttons">
                                <span className="material-icons">view_kanban</span>
                                <span>Board</span>
                            </div>
                        </Link>
                        <Link to="/ai">
                            <div className="buttons">
                            <span className="material-icons">star_rate</span>
                            <span>AI Generate</span>
                            </div>
                        </Link>
                        <Link to="/team">
                            <div className="buttons">
                                <span className="material-icons">group</span>
                                <span>Team</span>
                            </div>
                        </Link>
                        <Link to="/settings">
                            <div className="buttons">
                                <span className="material-icons">settings</span>
                                <span>Settings</span>
                            </div>
                        </Link>
                    </ul>
                </div>
                <div>
                    <hr />
                    <div className="ps-3">
                        <div className="buttons">
                        <span className="material-icons">wb_sunny</span>
                            <span>Light Mode</span>
                        </div>
                    </div>
                    <div className="px-3 d-flex justify-content-between align-items-center my-3">
                        <div className="d-flex">
                            <img src={ placeholder} alt="" />
                            <span className="text-light mx-2">example@gmail.com</span>
                        </div>
                        <span className="material-icons mb-2">exit_to_app</span>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Sidebar
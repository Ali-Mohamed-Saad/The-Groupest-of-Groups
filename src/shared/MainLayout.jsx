import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function MainLayout(){
    return(
        <>
        <div className="routes d-flex flex-grow-1 flex-column overflow-hidden h-100">
            <div className="d-flex overflow-hidden vh-100">
                <Sidebar></Sidebar>
                <Outlet></Outlet>
            </div>
        </div>
        </>
    )
}

export default MainLayout;
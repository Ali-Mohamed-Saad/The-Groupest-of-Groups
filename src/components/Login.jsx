import "../assets/css/Login.css";
import { Link } from "react-router-dom";

function Login(){
    return(
        <>
        <div className="d-flex flex-column justify-content-between vh-100">
            <div className="login-container">
                <div className="login-bolt-bg mx-auto">
                    <span className="bolt material-symbols-outlined text-dark">bolt</span>
                </div>
                <h3 className='text-light my-3 fw-bold text-center'>AI Sprint</h3>
                <h6 className='agent-subtext mx-auto text-center w-100 mb-4'>Welcome back! Sign in to continue.</h6>
                <form action="#">
                <div className="field d-flex rounded mb-3 p-1 w-100">
                        <span className="material-symbols-outlined p-2">mail</span>       
                        <input className="search-bar form-control mr-sm-2 p-0" type="text" placeholder="Email Address" aria-label="Search"></input>
                </div>
                <div className="field d-flex rounded mb-3 p-1 w-100">
                        <span className="material-symbols-outlined p-2">lock</span>       
                        <input className="search-bar form-control mr-sm-2 p-0" type="password" placeholder="Password" aria-label="Search"></input>
                </div>
                <button type="submit" className="sign-in d-flex justify-content-center align-items-center w-100 py-2">
                    <p className="mx-2">Sign In</p>
                    <span className="material-symbols-outlined text-dark"> arrow_forward </span>    
                </button>
                </form>
                <p className="no-account text-center mt-4">Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        <div className="light-mode-container mb-2">
            <button className="light-mode d-flex justify-content-center align-items-center mx-auto px-4">
            <span className="material-symbols-outlined"> sunny </span>    
            <p className="mx-2">Light Mode</p>
            </button>
        </div>
        
        </div>
        </>
    )
}

export default Login;
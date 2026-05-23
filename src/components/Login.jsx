import "../assets/css/Login.css";

function Login(){
    return(
        <>
            <div>
                <div className="bolt-bg mx-auto">
                    <span className="bolt material-symbols-outlined text-dark">bolt</span>
                </div>
                <h3 className='text-light my-3 fw-bold text-center'>AI Sprint</h3>
                <h6 className='agent-subtext fw-light mx-auto text-center'>Welcome back! Sign in to continue.</h6>
                <form action="">
                <div className="search d-flex rounded mx-3">
                        <span className="material-symbols-outlined p-2">mail</span>       
                        <input className="search-bar form-control mr-sm-2 p-0" type="text" placeholder="Email" aria-label="Search"></input>
                </div>
                <div className="search d-flex rounded mx-3">
                        <span className="material-symbols-outlined p-2">lock</span>       
                        <input className="search-bar form-control mr-sm-2 p-0" type="password" placeholder="Password" aria-label="Search"></input>
                </div>
                </form>
            </div>



        </>
    )
}

export default Login;
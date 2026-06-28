import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/SignUp.css";

function SignUp(){
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!fullName.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    full_name: fullName.trim(),
                    email: email.trim(),
                    password: password.trim()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }

            login(data.token, data.user);
            navigate("/");
        } catch (err) {
            console.error("SignUp submission error:", err);
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return(
        <>
        <div className="d-flex flex-column justify-content-between vh-100">
            <div className="login-container">
                <div className="login-bolt-bg mx-auto">
                    <span className="bolt material-symbols-outlined text-dark">bolt</span>
                </div>
                <h3 className='text-light my-3 fw-bold text-center'>AI Sprint</h3>
                <h6 className='agent-subtext mx-auto text-center w-100 mb-4'>Create your account to get started.</h6>
                <form onSubmit={handleSubmit}>
                <div className="field d-flex rounded mb-3 p-1 w-100">
                        <span className="material-symbols-outlined p-2">person</span>       
                        <input 
                            className="search-bar form-control mr-sm-2 p-0" 
                            type="text" 
                            placeholder="Full Name" 
                            aria-label="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={loading}
                            required
                        />
                </div>    
                <div className="field d-flex rounded mb-3 p-1 w-100">
                        <span className="material-symbols-outlined p-2">mail</span>       
                        <input 
                            className="search-bar form-control mr-sm-2 p-0" 
                            type="email" 
                            placeholder="Email Address" 
                            aria-label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                </div>
                <div className="field d-flex rounded mb-3 p-1 w-100">
                        <span className="material-symbols-outlined p-2">lock</span>       
                        <input 
                            className="search-bar form-control mr-sm-2 p-0" 
                            type="password" 
                            placeholder="Password" 
                            aria-label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                </div>
                <button type="submit" className="sign-in d-flex justify-content-center align-items-center w-100 py-2" disabled={loading}>
                    <p className="mx-2">{loading ? "Creating Account..." : "Create Account"}</p>
                    {!loading && <span className="material-symbols-outlined text-dark"> arrow_forward </span>}
                </button>
                </form>
                {error && <div className="text-danger text-center mt-3 small">{error}</div>}
                <p className="no-account text-center mt-4">Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
        </div>
        </>
    )
}

export default SignUp;
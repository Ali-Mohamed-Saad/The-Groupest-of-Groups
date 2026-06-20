// src/components/Settings/tabs/SecurityTab.jsx

import { useState } from "react";
import SettingsToast from "../../../shared/SettingsToast.jsx";
import ToggleSwitch from "../../../shared/ToggleSwitch.jsx";

const INITIAL_SESSIONS = [
    { id: 1, device: "Chrome on Windows (Current)", ip: "192.168.1.45", location: "Cairo, Egypt", isCurrent: true },
    { id: 2, device: "Safari on iPhone", ip: "197.34.88.102", location: "Alexandria, Egypt", isCurrent: false },
    { id: 3, device: "Firefox on MacOS", ip: "82.12.94.10", location: "London, UK", isCurrent: false },
];

export default function SecurityTab() {
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [sessions, setSessions] = useState(INITIAL_SESSIONS);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const showToast = (message) => {
        setToast({ show: true, message, type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    const toggle2FA = () => {
        const next = !twoFactorAuth;
        setTwoFactorAuth(next);
        showToast(`Two-Factor Authentication ${next ? "enabled" : "disabled"}`);
    };

    const revokeSession = (id) => {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        showToast("Session revoked successfully.");
    };

    return (
        <div className="settings-card">
            <h3 className="settings-card-title">Security Center</h3>
            <SettingsToast {...toast} />

            <ToggleSwitch
                title="Two-Factor Authentication (2FA)"
                description="Secure your account by requiring an OTP from a mobile authenticator app on login"
                checked={twoFactorAuth}
                onChange={toggle2FA}
            />

            <h4 className="settings-card-title mt-5 mb-3">Active Sessions</h4>
            <p className="text-muted mb-4" style={{ fontSize: "0.85rem" }}>
                You are signed in on these devices. If you see unrecognized activity, you can terminate a session immediately.
            </p>

            <div className="d-flex flex-column">
                {sessions.map((session) => (
                    <div key={session.id} className="session-item">
                        <div className="session-info">
                            <span className="material-symbols-outlined session-icon">
                                {session.device.toLowerCase().includes("iphone") ? "smartphone" : "desktop_windows"}
                            </span>
                            <div className="session-details">
                                <span className="session-device">{session.device}</span>
                                <span className="session-meta">{session.ip} • {session.location}</span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            {session.isCurrent ? (
                                <span className="session-status current">Active Now</span>
                            ) : (
                                <button
                                    onClick={() => revokeSession(session.id)}
                                    className="btn btn-outline-danger btn-sm px-3"
                                    style={{ fontSize: "0.75rem", borderRadius: "0.375rem" }}
                                >
                                    Revoke
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
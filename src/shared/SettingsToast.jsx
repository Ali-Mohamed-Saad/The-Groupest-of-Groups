// components/Settings/shared/SettingsToast.jsx

export default function SettingsToast({ show, message, type = "success" }) {
    if (!show) return null;

    return (
        <div
            className={`alert alert-${type} d-flex align-items-center mb-4`}
            role="alert"
            style={{ fontSize: "0.875rem", borderRadius: "0.5rem" }}
        >
            <span className="material-symbols-outlined me-2" style={{ fontSize: "1.25rem" }}>
                {type === "success" ? "check_circle" : "error"}
            </span>
            <div>{message}</div>
        </div>
    );
}
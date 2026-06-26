import { useState } from "react";
import SettingsToast from "../../../shared/SettingsToast";
import { useAuth } from "../../../context/AuthContext";

export default function AccountTab() {
    const { user } = useAuth();
    const [account, setAccount] = useState({
        username: user?.full_name || "janedoe",
        email: user?.email || "jane.doe@example.com",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    const handleChange = (field) => (e) =>
        setAccount((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (account.newPassword && account.newPassword.length < 6)
            errs.newPassword = "Password must be at least 6 characters";
        if (account.newPassword !== account.confirmPassword)
            errs.confirmPassword = "Passwords do not match";

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            showToast("Please fix the validation errors.", "danger");
            return;
        }

        setErrors({});
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setAccount((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        showToast("Account settings and password updated successfully!", "success");
        setLoading(false);
    };

    return (
        <div className="settings-card">
            <h3 className="settings-card-title">Account Settings</h3>
            <SettingsToast {...toast} />

            <form onSubmit={handleSubmit}>
                <div className="settings-form-group">
                    <label className="settings-label" htmlFor="acc-username">Change Username</label>
                    <input
                        id="acc-username"
                        type="text"
                        className="settings-input"
                        value={account.username}
                        onChange={handleChange("username")}
                        required
                    />
                </div>

                <div className="settings-form-group">
                    <label className="settings-label" htmlFor="acc-email">Primary Email Address</label>
                    <input
                        id="acc-email"
                        type="email"
                        className="settings-input"
                        value={account.email}
                        onChange={handleChange("email")}
                        required
                    />
                </div>

                <h4 className="settings-card-title mt-5 mb-4 border-top pt-4 border-secondary border-opacity-10">
                    Change Password
                </h4>

                <div className="settings-form-group">
                    <label className="settings-label" htmlFor="acc-currpass">Current Password</label>
                    <input
                        id="acc-currpass"
                        type="password"
                        className="settings-input"
                        placeholder="••••••••"
                        value={account.currentPassword}
                        onChange={handleChange("currentPassword")}
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 settings-form-group">
                        <label className="settings-label" htmlFor="acc-newpass">New Password</label>
                        <input
                            id="acc-newpass"
                            type="password"
                            className="settings-input"
                            placeholder="Min 6 characters"
                            value={account.newPassword}
                            onChange={handleChange("newPassword")}
                        />
                        {errors.newPassword && (
                            <span className="settings-error-text">{errors.newPassword}</span>
                        )}
                    </div>
                    <div className="col-md-6 settings-form-group">
                        <label className="settings-label" htmlFor="acc-confpass">Confirm New Password</label>
                        <input
                            id="acc-confpass"
                            type="password"
                            className="settings-input"
                            placeholder="Repeat password"
                            value={account.confirmPassword}
                            onChange={handleChange("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <span className="settings-error-text">{errors.confirmPassword}</span>
                        )}
                    </div>
                </div>

                <div className="d-flex gap-3 mt-4 border-top pt-4 border-secondary border-opacity-10 justify-content-end">
                    <button type="submit" disabled={loading} className="settings-btn-primary">
                        {loading ? "Updating Account..." : "Save Account"}
                    </button>
                </div>
            </form>
        </div>
    );
}
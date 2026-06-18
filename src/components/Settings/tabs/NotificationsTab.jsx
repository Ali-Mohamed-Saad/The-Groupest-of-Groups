// src/components/Settings/tabs/NotificationsTab.jsx

import { useState } from "react";
import SettingsToast from "../../shared/SettingsToast";
import ToggleSwitch from "../../shared/ToggleSwitch";

const NOTIFICATION_OPTIONS = [
    { key: "emailAlerts", title: "Email Alerts", description: "Receive immediate email updates regarding critical items and billing" },
    { key: "activityUpdates", title: "Activity Updates", description: "Get notified when team members leave comments on boards or tasks" },
    { key: "taskAssignments", title: "Task Assignments", description: "Receive push notifications when tasks are assigned to you" },
    { key: "weeklyDigest", title: "Weekly Digest Report", description: "A weekly summary of sprint speed, board status, and teammate tasks" },
    { key: "securityAlerts", title: "Security & Sign-ins", description: "Alert me of new sign-ins from unrecognized browsers or devices" },
];

export default function NotificationsTab() {
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        activityUpdates: false,
        taskAssignments: true,
        weeklyDigest: true,
        securityAlerts: true,
    });
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const toggle = (key) =>
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

    const handleSave = async () => {
        await new Promise((r) => setTimeout(r, 500));
        setToast({ show: true, message: "Notification preferences saved!", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    return (
        <div className="settings-card">
            <h3 className="settings-card-title">Notification Settings</h3>
            <SettingsToast {...toast} />

            <div className="mb-4">
                {NOTIFICATION_OPTIONS.map(({ key, title, description }) => (
                    <ToggleSwitch
                        key={key}
                        title={title}
                        description={description}
                        checked={notifications[key]}
                        onChange={() => toggle(key)}
                    />
                ))}
            </div>

            <div className="d-flex gap-3 mt-4 border-top pt-4 border-secondary border-opacity-10 justify-content-end">
                <button type="button" onClick={handleSave} className="settings-btn-primary">
                    Save Preferences
                </button>
            </div>
        </div>
    );
}
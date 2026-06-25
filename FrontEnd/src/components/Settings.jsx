// src/components/Settings.jsx

import { useState } from "react";
import SettingsNavbar from "./Settings/SettingsNavbar";
import ProfileTab from "./Settings/tabs/ProfileTab";
import AccountTab from "./Settings/tabs/AccountTab";
import NotificationsTab from "./Settings/tabs/NotificationsTab";
import SecurityTab from "./Settings/tabs/SecurityTab";
import AppearanceTab from "./Settings/tabs/AppearanceTab";
import "../assets/css/Settings.css";

const TAB_COMPONENTS = {
    profile: <ProfileTab />,
    account: <AccountTab />,
    notifications: <NotificationsTab />,
    security: <SecurityTab />,
    appearance: <AppearanceTab />,
};

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="settings-container d-flex flex-column h-100 w-100 overflow-hidden">
            <div className="settings-header">
                <h2 className="settings-title">Settings</h2>
                <div className="settings-subtitle">
                    Manage your account settings, notifications, security credentials, and appearances
                </div>
            </div>

            <div className="settings-content-wrapper flex-column">
                <SettingsNavbar activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="settings-workspace">
                    {TAB_COMPONENTS[activeTab]}
                </div>
            </div>
        </div>
    );
}
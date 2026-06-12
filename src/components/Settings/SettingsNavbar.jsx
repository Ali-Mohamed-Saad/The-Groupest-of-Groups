// components/Settings/SettingsNavbar.jsx

const TABS = [
    { id: "profile",       icon: "person",          label: "Profile" },
    { id: "account",       icon: "manage_accounts", label: "Account" },
    { id: "notifications", icon: "notifications",   label: "Notifications" },
    { id: "security",      icon: "security",        label: "Security" },
    { id: "appearance",    icon: "palette",         label: "Appearance" },
];

export default function SettingsNavbar({ activeTab, onTabChange }) {
    return (
        <div className="settings-navbar">
            {TABS.map(({ id, icon, label }) => (
                <button
                    key={id}
                    className={`settings-tab-btn ${activeTab === id ? "active" : ""}`}
                    onClick={() => onTabChange(id)}
                >
                    <span className="material-symbols-outlined">{icon}</span>
                    {label}
                </button>
            ))}
        </div>
    );
}
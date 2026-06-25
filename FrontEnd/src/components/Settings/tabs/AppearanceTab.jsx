// src/components/Settings/tabs/AppearanceTab.jsx

import { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import SettingsToast from "../../../shared/SettingsToast";

const ACCENT_COLORS = [
    { id: "blue",   hex: "#3C83F6", rgb: "60,131,246"  },
    { id: "purple", hex: "#8B5CF6", rgb: "139,92,246"  },
    { id: "green",  hex: "#10B981", rgb: "16,185,129"  },
    { id: "red",    hex: "#EF4444", rgb: "239,68,68"   },
    { id: "orange", hex: "#F59E0B", rgb: "245,158,11"  },
    { id: "cyan",   hex: "#06B6D4", rgb: "6,182,212"   },
];

const FONT_SIZE_MAP = {
    Small:  "13px",
    Medium: "15px",
    Large:  "17px",
};

export default function AppearanceTab() {
    const { activeTheme, toggleDarkLight } = useTheme();

    const [accent, setAccent]     = useState(() => localStorage.getItem("accent")   || "blue");
    const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "Medium");
    const [toast, setToast]       = useState({ show: false, message: "", type: "" });

    // Apply saved accent & font on mount
    useEffect(() => {
        const saved = ACCENT_COLORS.find(c => c.id === accent);
        if (saved) applyAccentVars(saved);
        document.documentElement.style.setProperty("--app-font-size", FONT_SIZE_MAP[fontSize] || "15px");
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const showToast = (message) => {
        setToast({ show: true, message, type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    const isDark = activeTheme?.isDark ?? true;

    /* ── Helpers ─────────────────────────────────── */
    const applyAccentVars = (c) => {
        document.documentElement.style.setProperty("--color-primary",     c.hex);
        document.documentElement.style.setProperty("--color-primary-rgb", c.rgb);
    };

    /* ── Handlers ────────────────────────────────── */
    const handleMode = (wantDark) => {
        if (wantDark !== isDark) toggleDarkLight();
        showToast(`Switched to ${wantDark ? "Dark" : "Light"} mode`);
    };

    const handleAccent = (c) => {
        setAccent(c.id);
        localStorage.setItem("accent", c.id);
        applyAccentVars(c);
        showToast("Accent color updated!");
    };

    const handleFontSize = (e) => {
        const val = e.target.value;
        setFontSize(val);
        localStorage.setItem("fontSize", val);
        document.documentElement.style.setProperty("--app-font-size", FONT_SIZE_MAP[val]);
        showToast(`Font size set to ${val}`);
    };

    /* ── Styles ──────────────────────────────────── */
    const modeCardStyle = (active) => ({
        flex: 1,
        maxWidth: "12rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.6rem",
        padding: "1.4rem 1rem",
        borderRadius: "0.6rem",
        border: `2px solid ${active ? "var(--color-primary, #3C83F6)" : "var(--color-border, #1D2435)"}`,
        backgroundColor: active ? "rgba(var(--color-primary-rgb, 60,131,246), 0.08)" : "var(--color-surface, #0C111E)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        color: active ? "var(--color-primary, #3C83F6)" : "var(--color-heading, #F8FAFC)",
        fontSize: "0.9rem",
        fontWeight: active ? 600 : 500,
        userSelect: "none",
    });

    return (
        <div className="settings-card">
            <h3 className="settings-card-title">Appearance</h3>
            <SettingsToast {...toast} />

            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #758884)", marginBottom: "1.75rem" }}>
                Customize how your workspace looks for you.
            </p>

            {/* ── Theme Mode ─────────────────────────── */}
            <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-heading, #F8FAFC)", marginBottom: "0.85rem" }}>
                    Theme mode
                </p>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button type="button" className={`settings-btn-primary${isDark ? " settings-btn-secondary" : ""}`}
                        style={modeCardStyle(!isDark)} onClick={() => handleMode(false)}>
                        <span className="material-symbols-outlined" style={{ fontSize: "1.75rem" }}>light_mode</span>
                        Light
                    </button>
                    <button type="button" className={`settings-btn-primary${!isDark ? " settings-btn-secondary" : ""}`}
                        style={modeCardStyle(isDark)} onClick={() => handleMode(true)}>
                        <span className="material-symbols-outlined" style={{ fontSize: "1.75rem" }}>dark_mode</span>
                        Dark
                    </button>
                </div>
            </div>

            {/* ── Accent Color ───────────────────────── */}
            <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-heading, #F8FAFC)", marginBottom: "0.85rem" }}>
                    Theme color
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {ACCENT_COLORS.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => handleAccent(c)}
                            title={c.id}
                            style={{
                                width: "2.5rem",
                                height: "2.5rem",
                                borderRadius: "50%",
                                backgroundColor: c.hex,
                                cursor: "pointer",
                                border: accent === c.id ? "3px solid #fff" : "3px solid transparent",
                                boxShadow: accent === c.id ? `0 0 0 2px ${c.hex}` : "none",
                                transition: "all 0.2s ease",
                                padding: 0,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ── Font Size ──────────────────────────── */}
            <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-heading, #F8FAFC)", marginBottom: "0.85rem" }}>
                    Font size
                </p>
                <select
                    value={fontSize}
                    onChange={handleFontSize}
                    className="settings-input"
                    style={{ maxWidth: "18rem", cursor: "pointer" }}
                >
                    {Object.keys(FONT_SIZE_MAP).map((s) => (
                        <option key={s} value={s}>{s} — {FONT_SIZE_MAP[s]}</option>
                    ))}
                </select>
            </div>

        </div>
    );
}
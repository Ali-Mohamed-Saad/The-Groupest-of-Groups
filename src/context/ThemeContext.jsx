import React, { createContext, useContext, useState, useEffect } from "react";

export const themes = [
    { id: "dark-blue", name: "Deep Navy Blue", primary: "#3C83F6", sidebar: "#0C111E", body: "#080C16", isDark: true },
    { id: "dark-emerald", name: "Emerald Mint", primary: "#10B77F", sidebar: "#0E1815", body: "#090F0D", isDark: true },
    { id: "dark-purple", name: "Midnight Violet", primary: "#8B5CF6", sidebar: "#120E1E", body: "#0A0812", isDark: true },
    { id: "glass-slate", name: "Glass Slate", primary: "#64748B", sidebar: "#1E293B", body: "#0F172A", isDark: true },
    { id: "light-blue", name: "Light Breeze", primary: "#3C83F6", sidebar: "#FFFFFF", body: "#F8FAFC", isDark: false },
    { id: "light-emerald", name: "Light Emerald", primary: "#10B77F", sidebar: "#FFFFFF", body: "#F4FBF7", isDark: false },
    { id: "light-purple", name: "Light Lavender", primary: "#8B5CF6", sidebar: "#FFFFFF", body: "#FAF5FF", isDark: false }
];

const themeMapping = {
    "dark-blue": "light-blue",
    "dark-emerald": "light-emerald",
    "dark-purple": "light-purple",
    "glass-slate": "light-blue",
    "light-blue": "dark-blue",
    "light-emerald": "dark-emerald",
    "light-purple": "dark-purple"
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark-blue";
    });

    const activeTheme = themes.find(t => t.id === currentTheme) || themes[0];

    useEffect(() => {
        localStorage.setItem("theme", currentTheme);
        document.body.setAttribute("data-theme", currentTheme);
        document.documentElement.setAttribute("data-bs-theme", activeTheme.isDark ? "dark" : "light");
    }, [currentTheme, activeTheme]);

    const toggleDarkLight = () => {
        const nextTheme = themeMapping[currentTheme] || "dark-blue";
        setCurrentTheme(nextTheme);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, activeTheme, setCurrentTheme, toggleDarkLight, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

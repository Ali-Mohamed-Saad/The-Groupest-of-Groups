// src/components/Settings/tabs/ProfileTab.jsx

import { useState, useRef } from "react";
import SettingsToast from "../../../shared/SettingsToast";

export default function ProfileTab() {
    const [profile, setProfile] = useState({
        firstName: "Jane",
        lastName: "Doe",
        bio: "",
        jobTitle: "",
        department: "",
        phone: "",
        location: "",
        github: "",
        linkedin: "",
        twitter: "",
    });
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const fileInputRef = useRef();

    const handleChange = (field) => (e) =>
        setProfile((prev) => ({ ...prev, [field]: e.target.value }));

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setAvatarSrc(ev.target.result);
        reader.readAsDataURL(file);
    };

    const getInitials = () =>
        `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setToast({ show: true, message: "Profile updated successfully!", type: "success" });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        setLoading(false);
    };

    return (
        <div className="settings-card">
            <h3 className="settings-card-title">Public Profile</h3>
            <SettingsToast {...toast} />

            <form onSubmit={handleSave}>

                {/* Avatar */}
                <div className="avatar-uploader-container">
                    <div
                        className="avatar-preview-wrapper"
                        onClick={() => fileInputRef.current.click()}
                    >
                        {avatarSrc ? (
                            <img src={avatarSrc} alt="Avatar" className="avatar-preview-img" />
                        ) : (
                            <span className="avatar-initials">{getInitials()}</span>
                        )}
                        <div className="avatar-overlay">
                            <span className="material-symbols-outlined">photo_camera</span>
                        </div>
                    </div>
                    <div className="avatar-info">
                        <label
                            className="avatar-upload-btn"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Upload Photo
                        </label>
                        <span className="avatar-upload-hint">JPG or PNG. Max 2MB.</span>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg"
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                    />
                </div>

                {/* Full Name */}
                <div className="row">
                    <div className="col-md-6 settings-form-group">
                        <label className="settings-label" htmlFor="prof-first">First Name</label>
                        <input
                            id="prof-first"
                            type="text"
                            className="settings-input"
                            value={profile.firstName}
                            onChange={handleChange("firstName")}
                        />
                    </div>
                    <div className="col-md-6 settings-form-group">
                        <label className="settings-label" htmlFor="prof-last">Last Name</label>
                        <input
                            id="prof-last"
                            type="text"
                            className="settings-input"
                            value={profile.lastName}
                            onChange={handleChange("lastName")}
                        />
                    </div>
                </div>

                {/* Bio */}
                <div className="settings-form-group">
                    <label className="settings-label" htmlFor="prof-bio">Bio</label>
                    <textarea
                        id="prof-bio"
                        className="settings-textarea"
                        placeholder="Tell your team a little about yourself..."
                        value={profile.bio}
                        onChange={handleChange("bio")}
                    />
                </div>

                {/* Job Title & Department */}
                <div className="row">
                    <div className="col-md-6 settings-form-group">
                        <label className="settings-label" htmlFor="prof-title">Job Title</label>
                        <input
                            id="prof-title"
                            type="text"
                            className="settings-input"
                            placeholder="e.g. Frontend Developer"
                            value={profile.jobTitle}
                            onChange={handleChange("jobTitle")}
                        />
                    </div>
                    <div className="col-md-6 settings-form-group">
                        <label className="settings-label" htmlFor="prof-dept">Department</label>
                        <input
                            id="prof-dept"
                            type="text"
                            className="settings-input"
                            placeholder="e.g. Engineering"
                            value={profile.department}
                            onChange={handleChange("department")}
                        />
                    </div>
                </div>

                {/* Phone & Location */}
                <div className="row">
                    <div className="col-md-6 settings-form-group">
                        <label className="settings-label" htmlFor="prof-phone">Phone</label>
                        <input
                            id="prof-phone"
                            type="tel"
                            className="settings-input"
                            placeholder="+20 100 000 0000"
                            value={profile.phone}
                            onChange={handleChange("phone")}
                        />
                    </div>
                    <div className="col-md-6 settings-form-group">
                        <label className="settings-label" htmlFor="prof-location">Location</label>
                        <input
                            id="prof-location"
                            type="text"
                            className="settings-input"
                            placeholder="e.g. Cairo, Egypt"
                            value={profile.location}
                            onChange={handleChange("location")}
                        />
                    </div>
                </div>

                {/* Social Links */}
                <h4 className="settings-card-title mt-5 mb-4 border-top pt-4 border-secondary border-opacity-10">
                    Social Links
                </h4>

                <div className="settings-form-group">
                    <label className="settings-label" htmlFor="prof-github">GitHub</label>
                    <input
                        id="prof-github"
                        type="url"
                        className="settings-input"
                        placeholder="https://github.com/username"
                        value={profile.github}
                        onChange={handleChange("github")}
                    />
                </div>

                <div className="settings-form-group">
                    <label className="settings-label" htmlFor="prof-linkedin">LinkedIn</label>
                    <input
                        id="prof-linkedin"
                        type="url"
                        className="settings-input"
                        placeholder="https://linkedin.com/in/username"
                        value={profile.linkedin}
                        onChange={handleChange("linkedin")}
                    />
                </div>

                <div className="settings-form-group">
                    <label className="settings-label" htmlFor="prof-twitter">Twitter / X</label>
                    <input
                        id="prof-twitter"
                        type="url"
                        className="settings-input"
                        placeholder="https://twitter.com/username"
                        value={profile.twitter}
                        onChange={handleChange("twitter")}
                    />
                </div>

                <div className="d-flex gap-3 mt-4 border-top pt-4 border-secondary border-opacity-10 justify-content-end">
                    <button type="submit" disabled={loading} className="settings-btn-primary">
                        {loading ? "Saving Profile..." : "Save Profile"}
                    </button>
                </div>

            </form>
        </div>
    );
}
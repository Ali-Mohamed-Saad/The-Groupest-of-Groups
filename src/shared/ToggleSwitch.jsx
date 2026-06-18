// components/Settings/shared/ToggleSwitch.jsx

export default function ToggleSwitch({ title, description, checked, onChange }) {
    return (
        <div className="custom-switch-wrapper">
            <div className="custom-switch-info">
                <span className="custom-switch-title">{title}</span>
                <span className="custom-switch-desc">{description}</span>
            </div>
            <label className="custom-switch">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <span className="custom-switch-slider"></span>
            </label>
        </div>
    );
}
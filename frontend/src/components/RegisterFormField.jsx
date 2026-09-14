function Field({
    icon: Icon,
    label,
    type = "text",
    placeholder,
    required = false,
    value,
    onChange,
    children,
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {label}
            </label>
            {children ?? (
                <div className="relative">
                    <Icon
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                        className="input pl-10"
                        type={type}
                        placeholder={placeholder}
                        required={required}
                        value={value}
                        onChange={onChange}
                    />
                </div>
            )}
        </div>
    );
}

export default Field;

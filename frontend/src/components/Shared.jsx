import React from 'react';

const iconPaths = {
    overview: <><path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z" /></>,
    customers: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    experiments: <><path d="M9 3h6M10 9l-5.5 9.2A1.8 1.8 0 0 0 6 21h12a1.8 1.8 0 0 0 1.5-2.8L14 9V3h-4v6Z" /><path d="M8 15h8" /></>,
    assignments: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h4M7 16h7" /></>,
    interventions: <path d="m12 3-1.9 5.8H4l5 3.6L7.1 18l4.9-3.5 4.9 3.5-1.9-5.6 5-3.6h-6.1L12 3Z" />,
    deliveries: <><path d="M3 6h13v12H3zM16 10h3l2 3v5h-5zM7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></>,
    outcomes: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.37.4.7.72.94.3.23.68.36 1.08.36h.1v4h-.1a1.7 1.7 0 0 0-1.8.7Z" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M17 11h5M19.5 8.5v5" /></>,
    trend: <><path d="M3 3v18h18M7 15l4-4 3 3 6-7" /></>,
    warning: <><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 9v4M12 17h.01" /></>,
    flask: <><path d="M9 3h6M10 9l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3h-4v6Z" /></>,
    retained: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    assigned: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 3v4h6V3M8 12h8M8 16h5" /></>,
    'log-out': <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    edit: <><path d="m16 4 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>
};

export function Icon({ name, size = 18 }) {
    const iconName = name === 'management' ? 'experiments' : name;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={iconName === 'overview' ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {iconPaths[iconName]}
        </svg>
    );
}

export function StatusBadge({ value }) {
    const normalized = String(value || 'UNKNOWN')
        .toLowerCase()
        .replaceAll('_', '-')
        .replaceAll(' ', '-');

    return (
        <span className={`badge badge-${normalized}`}>
            <span className="badge-dot" />
            {String(value || 'UNKNOWN').replaceAll('_', ' ')}
        </span>
    );
}

export function Button({
    children,
    variant = 'primary',
    icon,
    onClick,
    type = 'button',
    disabled = false
}) {
    return (
        <button
            type={type}
            className={`button button-${variant}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <Icon name={icon} size={16} />}
            {children}
        </button>
    );
}

export function KpiCard({
    label,
    value = '—',
    icon,
    tone = 'indigo'
}) {
    return (
        <div className="card kpi-card">
            <div className={`kpi-icon tone-${tone}`}>
                <Icon name={icon} size={19} />
            </div>
            <div className="kpi-label">{label}</div>
            <div className="kpi-row">
                <strong>{value}</strong>
            </div>
        </div>
    );
}

export function Card({
    title,
    subtitle,
    action,
    children,
    className = ''
}) {
    return (
        <section className={`card ${className}`}>
            <div className="card-header">
                <div>
                    <h3>{title}</h3>
                    {subtitle && <p>{subtitle}</p>}
                </div>
                {action}
            </div>
            <div className="card-content">{children}</div>
        </section>
    );
}

export function SearchInput({ placeholder = 'Search…' }) {
    return (
        <label className="search-box">
            <Icon name="search" size={16} />
            <input placeholder={placeholder} />
        </label>
    );
}

export function Select({ children, label }) {
    return (
        <label className="select-wrap">
            {label && <span>{label}</span>}
            <select>{children}</select>
            <span className="select-caret">⌄</span>
        </label>
    );
}

export function EmptyState({
    title = 'No records available',
    description = 'Records will appear here after data is loaded from the backend.'
}) {
    return (
        <div className="state-placeholder">
            <div className="kpi-icon tone-indigo">
                <Icon name="assigned" />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export function DataTable({
    headers,
    rows = [],
    badgeColumns = []
}) {
    return (
        <div className="table-shell">
            <table>
                <thead>
                    <tr>
                        {headers.map(header => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length}>
                                <EmptyState />
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, index) => (
                            <tr key={row[0] ?? index}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>
                                        {badgeColumns.includes(cellIndex)
                                            ? <StatusBadge value={cell} />
                                            : cell}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export function Filters({ search, children }) {
    return (
        <div className="filters">
            <SearchInput placeholder={search} />
            <div className="filter-group">{children}</div>
        </div>
    );
}
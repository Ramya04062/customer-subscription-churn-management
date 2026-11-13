
import React from 'react';
import { Icon } from './Shared';

const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'management', label: 'Experiment & Intervention' },
    { id: 'assignments', label: 'Customer Assignments' },
    { id: 'outcomes', label: 'Outcome Tracking' }
];

export default function Sidebar({
    page,
    setPage,
    collapsed,
    setCollapsed,
    mobileOpen,
    closeMobile,
    onLogout,
    user
}) {
    const go = id => {
        setPage(id);
        closeMobile();
    };

    return (
        <>
            <aside
                className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
            >
                <div className="brand">
                    {!collapsed && <strong>Star+</strong>}

                    <button
                        className="mobile-close"
                        onClick={closeMobile}
                    >
                        <Icon name="close" />
                    </button>
                </div>

                <nav>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={page === item.id ? 'active' : ''}
                            onClick={() => go(item.id)}
                            title={collapsed ? item.label : undefined}
                        >
                            {collapsed
                                ? <Icon name={item.id} size={19} />
                                : <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <div className="profile">
                        <div className="avatar">SC</div>

                        {!collapsed && (
                            <>
                                <div>
                                    <strong>{user?.email || 'Workspace user'}</strong>
                                    <span>{user?.role || 'Administrator'}</span>
                                </div>

                                <Icon name="more" size={18} />
                            </>
                        )}
                    </div>

                    <button
                        className="sidebar-logout"
                        onClick={onLogout}
                        title="Logout"
                    >
                        {collapsed ? (
                            <span className="logout-icon">
                                <Icon name="log-out" size={20} />
                            </span>
                        ) : (
                            <span>Logout</span>
                        )}
                    </button>
                </div>

                <button
                    className="collapse-button"
                    onClick={() => setCollapsed(value => !value)}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <Icon name="chevron" size={15} />
                </button>
            </aside>

            {mobileOpen && (
                <div
                    className="sidebar-scrim"
                    onClick={closeMobile}
                />
            )}
        </>
    );
}

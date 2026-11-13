
import React from 'react';
import { Button, Icon, SearchInput } from './Shared';

export default function Topbar({
    meta,
    setMobileOpen,
    onPrimaryAction
}) {
    return (
        <>
            <header className="topbar">
                <button
                    className="menu-button"
                    onClick={() => setMobileOpen(true)}
                >
                    <Icon name="menu" />
                </button>

                <div className="page-heading">
                    <div className="breadcrumbs">
                        <span>Star+</span>
                        <Icon name="chevron" size={12} />
                        <span>{meta.title}</span>
                    </div>

                    <h1>{meta.title}</h1>
                    <p>{meta.desc}</p>
                </div>

                <div className="top-actions">
                    <SearchInput placeholder="Search Star+…" />

                    <button className="icon-button" aria-label="Notifications">
                        <Icon name="bell" />
                        <span className="notification-dot" />
                    </button>

                    <div className="top-profile">
                        <div className="avatar">SC</div>
                    </div>

                    {meta.action && (
                        <Button
                            icon="plus"
                            onClick={onPrimaryAction}
                        >
                            {meta.action}
                        </Button>
                    )}
                </div>
            </header>

            <div className="mobile-page-actions">
                {meta.action && (
                    <Button
                        icon="plus"
                        onClick={onPrimaryAction}
                    >
                        {meta.action}
                    </Button>
                )}
            </div>
        </>
    );
}

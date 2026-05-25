import React from 'react';

const AdminStats = ({ stats }) => {
    return (
        <div className="admin-stats">
            <div className="stat-card">
                <div className="stat-icon"></div>
                <div className="stat-info">
                    <p className="stat-label">Total Users</p>
                    <p className="stat-value">{stats.users}</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon"></div>
                <div className="stat-info">
                    <p className="stat-label">Total Places</p>
                    <p className="stat-value">{stats.places}</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon"></div>
                <div className="stat-info">
                    <p className="stat-label">Total Reviews</p>
                    <p className="stat-value">{stats.reviews}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;

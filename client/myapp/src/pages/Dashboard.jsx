import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h1 className="text-primary">Welcome to Tripfy</h1>
                <p className="text-secondary">Your journey begins here.</p>
            </div>

            <div className="dashboard-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* Quick Stats */}
                <div className="card">
                    <h3>Your Plans</h3>
                    <p className="text-muted">You have 0 active plans.</p>
                    <div style={{ marginTop: '1rem' }}>
                        <Link to="/plans" className="btn btn-primary">Create New Plan</Link>
                    </div>
                </div>

                <div className="card">
                    <h3>Favorites</h3>
                    <p className="text-muted">0 saved places.</p>
                    <div style={{ marginTop: '1rem' }}>
                        <Link to="/places" className="btn btn-primary" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>Explore Places</Link>
                    </div>
                </div>

                {/* Featured Card */}
                <div className="card" style={{ gridColumn: '1 / -1', background: 'var(--color-primary-gradient)' }}>
                    <h3 style={{ color: 'white' }}>Trending Destinations</h3>
                    <p style={{ color: 'rgba(255,255,255,0.9)' }}>Discover popular spots for your next adventure.</p>
                    <div style={{ marginTop: '1rem' }}>
                        <button className="btn" style={{ background: 'white', color: 'var(--color-primary)' }}>View Trends</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useMyPlans } from './hooks/useMyPlans';
import ConfirmModal from '../../components/common/Modal/ConfirmModal';
import PlanCard from './components/PlanCard';
import './MyPlans.css';

const AuthPrompt = ({ onSignIn }) => (
    <div className="my-plans-auth">
        <h2 className="my-plans-auth__title">Sign in to view your trips</h2>
        <p className="my-plans-auth__text">
            Create an account or log in to save and manage your travel plans.
        </p>
        <button className="btn btn-primary" onClick={onSignIn}>
            Sign In
        </button>
    </div>
);

const EmptyState = () => (
    <div className="my-plans-empty">
        <div className="my-plans-empty__icon">Trips</div>
        <h2 className="my-plans-empty__title">No trips yet</h2>
        <p className="my-plans-empty__text">
            Start planning your next trip in Kurdistan.
        </p>
        <Link to="/plan" className="btn btn-primary">
            Create Your First Trip
        </Link>
    </div>
);

const LoadingState = () => (
    <div className="my-plans-loading">
        <div className="my-plans-spinner"></div>
        <p>Loading your trips...</p>
    </div>
);

const ErrorState = ({ message }) => (
    <div className="my-plans-empty">
        <p>{message}</p>
    </div>
);

const MyPlans = () => {
    const { user, openAuthModal } = useAuth();
    const { showToast } = useToast();
    const {
        plans,
        loading,
        error,
        hasMore,
        loadingMore,
        planToDelete,
        loadMorePlans,
        initiateDelete,
        confirmDelete,
        cancelDelete
    } = useMyPlans(user, showToast);

    if (!user) {
        return (
            <div className="my-plans-page">
                <main className="my-plans-main">
                    <div className="container">
                        <div className="my-plans-topbar">
                            <h1 className="my-plans-title">My Trips</h1>
                        </div>
                        <AuthPrompt onSignIn={() => openAuthModal('login')} />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="my-plans-page">
            <main className="my-plans-main">
                <div className="container">
                    <div className="my-plans-topbar">
                        <div>
                            <h1 className="my-plans-title">My Trips</h1>
                            <p className="my-plans-count">
                                {plans.length} {plans.length === 1 ? 'trip' : 'trips'}
                            </p>
                        </div>
                        <Link to="/plan" className="btn btn-primary">
                            Create New Trip
                        </Link>
                    </div>

                    {loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} />
                    ) : plans.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <div className="my-plans-grid">
                                {plans.map(plan => (
                                    <PlanCard
                                        key={plan._id}
                                        plan={plan}
                                        onInitiateDelete={initiateDelete}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="my-plans-load-more">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={loadMorePlans}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? 'Loading...' : 'Load More Plans'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <ConfirmModal
                isOpen={!!planToDelete}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Delete Trip"
                message="Are you sure you want to delete this trip? this action cannot be undone."
                confirmText="Delete Trip"
            />
        </div>
    );
};

export default MyPlans;

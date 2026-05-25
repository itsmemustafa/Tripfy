import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import {
    getAllUsersAdmin,
    getAllPlacesAdmin,
    getAllReviewsAdmin,
    updateUserRole,
    deletePlaceAdmin,
    deleteReviewAdmin,
    createUserAdmin,
    deleteUserAdmin,
    updatePlaceAdmin,
    createPlaceAdmin
} from '../../api/admin';
import AddUserModal from './components/AddUserModal';
import EditPlaceModal from './components/EditPlaceModal';
import AddPlaceModal from './components/AddPlaceModal';
import ConfirmModal from '../../components/common/Modal/ConfirmModal';
import './Admin.css';
import AdminStats from './components/AdminStats';
import AdminUsersTable from './components/AdminUsersTable';
import AdminPlacesTable from './components/AdminPlacesTable';
import AdminReviewsTable from './components/AdminReviewsTable';

const Admin = () => {
    const { user, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [places, setPlaces] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal States
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditPlaceModalOpen, setIsEditPlaceModalOpen] = useState(false);
    const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);
    const [editingPlace, setEditingPlace] = useState(null);

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const closeConfirmModal = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

    // Redirect if not admin
    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    // Fetch data based on active tab
    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'users') {
                const data = await getAllUsersAdmin();
                setUsers(data.users || []);
            } else if (activeTab === 'places') {
                const data = await getAllPlacesAdmin();
                setPlaces(data.places || []);
            } else if (activeTab === 'reviews') {
                const data = await getAllReviewsAdmin();
                setReviews(data.reviews || []);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- User Actions ---
    const handleRoleChange = (userId, newRole) => {
        setConfirmModal({
            isOpen: true,
            title: 'Change User Role',
            message: `Are you sure you want to change user role to ${newRole}?`,
            onConfirm: async () => {
                try {
                    await updateUserRole(userId, newRole);
                    showToast('User role updated successfully', 'success');
                    fetchData();
                } catch (err) {
                    showToast(err.message, 'error');
                } finally {
                    closeConfirmModal();
                }
            }
        });
    };

    const handleDeleteUser = (userId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This cannot be undone.',
            onConfirm: async () => {
                try {
                    await deleteUserAdmin(userId);
                    setUsers(users.filter(u => u._id !== userId));
                    showToast('User deleted successfully', 'success');
                } catch (err) {
                    showToast(err.message, 'error');
                } finally {
                    closeConfirmModal();
                }
            }
        });
    };

    const handleAddUserSubmit = async (userData) => {
        await createUserAdmin(userData);
        fetchData(); // Refresh list
    };

    // --- Place Actions ---
    const handleDeletePlace = (placeId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Place',
            message: 'Are you sure you want to delete this place?',
            onConfirm: async () => {
                try {
                    await deletePlaceAdmin(placeId);
                    setPlaces(places.filter(p => p._id !== placeId));
                    showToast('Place deleted successfully', 'success');
                } catch (err) {
                    showToast(err.message, 'error');
                } finally {
                    closeConfirmModal();
                }
            }
        });
    };

    const handleEditPlaceClick = (place) => {
        setEditingPlace(place);
        setIsEditPlaceModalOpen(true);
    };

    const handleEditPlaceSubmit = async (placeId, placeData) => {
        await updatePlaceAdmin(placeId, placeData);
        fetchData(); // Refresh list to show updates
    };

    const handleAddPlaceSubmit = async (placeData) => {
        await createPlaceAdmin(placeData);
        fetchData(); // Refresh list to show updates
    };

    // Review Actions 
    const handleDeleteReview = (reviewId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Review',
            message: 'Are you sure you want to delete this review?',
            onConfirm: async () => {
                try {
                    await deleteReviewAdmin(reviewId);
                    setReviews(reviews.filter(r => r._id !== reviewId));
                    showToast('Review deleted successfully', 'success');
                } catch (err) {
                    showToast(err.message, 'error');
                } finally {
                    closeConfirmModal();
                }
            }
        });
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                <header className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage users, places, and reviews</p>
                </header>

                {/* Stats Cards */}
                <AdminStats stats={{ users: users.length, places: places.length, reviews: reviews.length }} />

                {/* Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'places' ? 'active' : ''}`}
                        onClick={() => setActiveTab('places')}
                    >
                        Places
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                </div>

                {/* Content */}
                <div className="admin-content">
                    {loading && users.length === 0 && places.length === 0 && reviews.length === 0 ? (
                        <div className="admin-loading">
                            <div className="places__spinner"></div>
                            <p>Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="admin-error">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'users' && (
                                <AdminUsersTable
                                    users={users}
                                    setIsAddUserModalOpen={setIsAddUserModalOpen}
                                    handleRoleChange={handleRoleChange}
                                    handleDeleteUser={handleDeleteUser}
                                />
                            )}

                            {activeTab === 'places' && (
                                <AdminPlacesTable
                                    places={places}
                                    setIsAddPlaceModalOpen={setIsAddPlaceModalOpen}
                                    handleEditPlaceClick={handleEditPlaceClick}
                                    handleDeletePlace={handleDeletePlace}
                                />
                            )}

                            {activeTab === 'reviews' && (
                                <AdminReviewsTable
                                    reviews={reviews}
                                    handleDeleteReview={handleDeleteReview}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onAdd={handleAddUserSubmit}
            />

            <EditPlaceModal
                isOpen={isEditPlaceModalOpen}
                onClose={() => setIsEditPlaceModalOpen(false)}
                onSave={handleEditPlaceSubmit}
                place={editingPlace}
            />

            <AddPlaceModal
                isOpen={isAddPlaceModalOpen}
                onClose={() => setIsAddPlaceModalOpen(false)}
                onAdd={handleAddPlaceSubmit}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </div>
    );
};

export default Admin;

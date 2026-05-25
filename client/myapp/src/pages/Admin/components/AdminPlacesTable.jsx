import React from 'react';

const AdminPlacesTable = ({ places, setIsAddPlaceModalOpen, handleEditPlaceClick, handleDeletePlace }) => {
    return (
        <div className="admin-table-container">
            <div className="admin-actions-bar">
                <button
                    className="btn-add"
                    onClick={() => setIsAddPlaceModalOpen(true)}
                >
                    + Add Place
                </button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>City</th>
                        <th>Category</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {places.map((place) => (
                        <tr key={place._id}>
                            <td>{place.name}</td>
                            <td>{place.location?.city || 'N/A'}</td>
                            <td>{place.category}</td>
                            <td>{place.rating?.toFixed(1) || 'N/A'}</td>
                            <td className="actions-cell">
                                <button
                                    className="btn-edit"
                                    onClick={() => handleEditPlaceClick(place)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDeletePlace(place._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPlacesTable;

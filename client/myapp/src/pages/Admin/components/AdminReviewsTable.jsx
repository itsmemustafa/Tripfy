import React from 'react';

const AdminReviewsTable = ({ reviews, handleDeleteReview }) => {
    return (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Place</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review._id}>
                            <td>{review.user?.name || 'Unknown'}</td>
                            <td>{review.place?.name || 'Unknown'}</td>
                            <td>{review.rating}</td>
                            <td className="review-comment">{review.comment}</td>
                            <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDeleteReview(review._id)}
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

export default AdminReviewsTable;

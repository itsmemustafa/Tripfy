import React from 'react';

const AdminUsersTable = ({ users, setIsAddUserModalOpen, handleRoleChange, handleDeleteUser }) => {
    return (
        <div className="admin-table-container">
            <div className="admin-actions-bar">
                <button
                    className="btn-add"
                    onClick={() => setIsAddUserModalOpen(true)}
                >
                    + Add User
                </button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                                <span className={`role-badge ${u.role}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="actions-cell">
                                <select
                                    value={u.role}
                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                    className="role-select"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button
                                    className="btn-delete-icon"
                                    onClick={() => handleDeleteUser(u._id)}
                                    title="Delete User"
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

export default AdminUsersTable;

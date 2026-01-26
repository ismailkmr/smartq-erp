import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EmployeeManagement.css';
import API_URL from '../config';

function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        position: '',
        department: '',
        expiry_date: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_URL}/employees`);
            const data = await response.json();
            if (data.success) {
                setEmployees(data.employees);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            const data = await response.json();

            if (data.success) {
                // Refresh list and clear form
                fetchEmployees();
                setNewItem({
                    name: '',
                    position: '',
                    department: '',
                    expiry_date: ''
                });
                setShowModal(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Failed to add employee');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;

        try {
            const response = await fetch(`${API_URL}/employees/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchEmployees();
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const getStatus = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) return { label: 'Expired', class: 'status-expired' };
        if (daysUntilExpiry <= 30) return { label: 'Expiring Soon', class: 'status-expiring' };
        return { label: 'Active', class: 'status-active' };
    };

    return (
        <div className="employee-layout">
            <div className="employee-container">
                <div className="employee-header">
                    <Link to="/" className="back-button">← Back to Dashboard</Link>
                    <button className="add-button" onClick={() => setShowModal(true)}>
                        <span>+</span> Add New Employee
                    </button>
                </div>

                <div className="employee-content">
                    {/* Add Employee Form */}


                    {/* Employee List */}
                    <div className="employee-card employee-list">
                        <table className="employee-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Department</th>
                                    <th>Expiry Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td></tr>
                                ) : employees.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center' }}>No employees found</td></tr>
                                ) : (
                                    employees.map(emp => {
                                        const status = getStatus(emp.expiry_date);
                                        return (
                                            <tr key={emp.id}>
                                                <td>{emp.name}</td>
                                                <td>{emp.position}</td>
                                                <td>{emp.department}</td>
                                                <td>{new Date(emp.expiry_date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-badge ${status.class}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDelete(emp.id)}
                                                        className="delete-button"
                                                        title="Delete Employee"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Employee</h2>
                            <button className="close-button" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newItem.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Position</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={newItem.position}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Senior Developer"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Department</label>
                                    <select
                                        name="department"
                                        value={newItem.department}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="IT">IT</option>
                                        <option value="HR">HR</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Operations">Operations</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Contract/Visa Expiry Date</label>
                                    <input
                                        type="date"
                                        name="expiry_date"
                                        value={newItem.expiry_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="submit-button">
                                    Add Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeManagement;

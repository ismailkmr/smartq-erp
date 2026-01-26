import { useState } from 'react';
import './DayBook.css';
import API_URL from '../config';

function DayBook() {
    const [entries, setEntries] = useState([
        {
            id: 1,
            date: '2026-01-15',
            voucherNo: 'VCH001',
            particulars: 'Cash Sales',
            debit: 15000,
            credit: 0,
            balance: 15000
        },
        {
            id: 2,
            date: '2026-01-15',
            voucherNo: 'VCH002',
            particulars: 'Purchase of Goods',
            debit: 0,
            credit: 8500,
            balance: 6500
        },
        {
            id: 3,
            date: '2026-01-14',
            voucherNo: 'VCH003',
            particulars: 'Salary Payment',
            debit: 0,
            credit: 5000,
            balance: 1500
        },
        {
            id: 4,
            date: '2026-01-14',
            voucherNo: 'VCH004',
            particulars: 'Rent Received',
            debit: 3000,
            credit: 0,
            balance: 4500
        },
        {
            id: 5,
            date: '2026-01-13',
            voucherNo: 'VCH005',
            particulars: 'Office Supplies',
            debit: 0,
            credit: 1200,
            balance: 3300
        },
        {
            id: 6,
            date: '2026-01-13',
            voucherNo: 'VCH006',
            particulars: 'Service Income',
            debit: 7200,
            credit: 0,
            balance: 10500
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        voucherNo: '',
        particulars: '',
        type: 'debit',
        amount: ''
    });
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const amount = parseFloat(formData.amount);
        if (!amount || !formData.particulars || !formData.voucherNo) return;

        setIsUploading(true);
        let imageUrl = '';

        if (file) {
            const uploadData = new FormData();
            uploadData.append('image', file);

            try {
                const response = await fetch(`${API_URL}/daybook/upload`, {
                    method: 'POST',
                    body: uploadData,
                });
                const result = await response.json();
                if (result.success) {
                    imageUrl = result.imageUrl;
                }
            } catch (error) {
                console.error('File upload failed:', error);
            }
        }

        const lastEntry = entries[0];
        const lastBalance = lastEntry ? lastEntry.balance : 0;

        let newBalance = lastBalance;
        if (formData.type === 'debit') {
            newBalance += amount;
        } else {
            newBalance -= amount;
        }

        const newEntry = {
            id: Date.now(),
            date: formData.date,
            voucherNo: formData.voucherNo,
            particulars: formData.particulars,
            debit: formData.type === 'debit' ? amount : 0,
            credit: formData.type === 'credit' ? amount : 0,
            balance: newBalance,
            image: imageUrl
        };

        setEntries([newEntry, ...entries]);
        setShowForm(false);
        setIsUploading(false);
        setFile(null);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            voucherNo: '',
            particulars: '',
            type: 'debit',
            amount: ''
        });
    };

    const [filterDate, setFilterDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Calculate totals
    const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);

    // Filter entries
    const filteredEntries = entries.filter(entry => {
        const matchesDate = filterDate ? entry.date === filterDate : true;
        const matchesSearch = searchQuery
            ? entry.particulars.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.voucherNo.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesDate && matchesSearch;
    });

    return (
        <div className="daybook-container">
            <div className="daybook-header">

                <div className="daybook-actions">
                    <input
                        type="text"
                        placeholder="Search by particulars or voucher..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <input
                        type="date"
                        className="date-filter"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        <span className="icon">➕</span>
                        New Entry
                    </button>
                </div>
            </div>

            <div className="daybook-summary">
                <div className="summary-card debit">
                    <div className="summary-label">Total Debit</div>
                    <div className="summary-value">${totalDebit.toLocaleString()}</div>
                </div>
                <div className="summary-card credit">
                    <div className="summary-label">Total Credit</div>
                    <div className="summary-value">${totalCredit.toLocaleString()}</div>
                </div>
                <div className="summary-card balance">
                    <div className="summary-label">Net Balance</div>
                    <div className="summary-value">${(totalDebit - totalCredit).toLocaleString()}</div>
                </div>
            </div>

            <div className="daybook-table-container">
                <table className="daybook-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Voucher No.</th>
                            <th>Particulars</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            <th>Balance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEntries.length > 0 ? (
                            filteredEntries.map((entry) => (
                                <tr key={entry.id}>
                                    <td>{new Date(entry.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}</td>
                                    <td className="voucher-no">{entry.voucherNo}</td>
                                    <td className="particulars">
                                        {entry.particulars}
                                        {entry.image && (
                                            <div className="entry-attachment">
                                                <a href={entry.image} target="_blank" rel="noopener noreferrer">
                                                    View Attachment 📎
                                                </a>
                                            </div>
                                        )}
                                    </td>
                                    <td className="amount debit-amount">
                                        {entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="amount credit-amount">
                                        {entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="amount balance-amount">
                                        ${entry.balance.toLocaleString()}
                                    </td>
                                    <td className="actions">
                                        <button className="action-btn edit" title="Edit">✏️</button>
                                        <button className="action-btn delete" title="Delete">🗑️</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">
                                    No entries found
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="totals-row">
                            <td colSpan="3"><strong>Totals</strong></td>
                            <td className="amount debit-amount">
                                <strong>${totalDebit.toLocaleString()}</strong>
                            </td>
                            <td className="amount credit-amount">
                                <strong>${totalCredit.toLocaleString()}</strong>
                            </td>
                            <td className="amount balance-amount">
                                <strong>${(totalDebit - totalCredit).toLocaleString()}</strong>
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>New Entry</h2>
                            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Voucher No.</label>
                                    <input
                                        type="text"
                                        name="voucherNo"
                                        value={formData.voucherNo}
                                        onChange={handleInputChange}
                                        placeholder="e.g. VCH007"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select name="type" value={formData.type} onChange={handleInputChange}>
                                        <option value="debit">Debit (In)</option>
                                        <option value="credit">Credit (Out)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Particulars</label>
                                <input
                                    type="text"
                                    name="particulars"
                                    value={formData.particulars}
                                    onChange={handleInputChange}
                                    placeholder="Enter description"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Attachment (Image)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="action-btn cancel" onClick={() => setShowForm(false)} disabled={isUploading}>Cancel</button>
                                <button type="submit" className="action-btn save" disabled={isUploading}>
                                    {isUploading ? 'Uploading...' : 'Save Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DayBook;

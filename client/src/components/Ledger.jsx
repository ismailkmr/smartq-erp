
import { useState, useMemo } from 'react';
import './Ledger.css';

function Ledger() {
    const [selectedAccount, setSelectedAccount] = useState('Cash Account');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const accounts = [
        'Cash Account',
        'Bank Account',
        'Sales Account',
        'Purchase Account',
        'Salary Expense',
        'Rent Expense',
        'Office Supplies'
    ];
    // Mock Data - normally this would come from an API based on selectedAccount
    const allTransactions = {
        'Cash Account': [
            { id: 1, date: '2026-01-01', particular: 'Opening Balance', vchNo: '', type: 'Debit', amount: 50000 },
            { id: 2, date: '2026-01-05', particular: 'Sales Account', vchNo: 'RCP001', type: 'Debit', amount: 15000 },
            { id: 3, date: '2026-01-10', particular: 'Rent Expense', vchNo: 'PMT001', type: 'Credit', amount: 5000 },
            { id: 4, date: '2026-01-12', particular: 'Office Supplies', vchNo: 'PMT002', type: 'Credit', amount: 1200 },
        ],
        'Bank Account': [
            { id: 1, date: '2026-01-01', particular: 'Opening Balance', vchNo: '', type: 'Debit', amount: 100000 },
            { id: 2, date: '2026-01-08', particular: 'Sales Account (Transfer)', vchNo: 'RCP002', type: 'Debit', amount: 25000 },
            { id: 3, date: '2026-01-15', particular: 'Vendor Payment', vchNo: 'PMT003', type: 'Credit', amount: 12000 },
        ],
        'Sales Account': [
            { id: 1, date: '2026-01-05', particular: 'Cash Account', vchNo: 'RCP001', type: 'Credit', amount: 15000 },
            { id: 2, date: '2026-01-08', particular: 'Bank Account', vchNo: 'RCP002', type: 'Credit', amount: 25000 },
        ],
        // ... default empty for others for demo
    };

    const transactions = useMemo(() => {
        const accountTrans = allTransactions[selectedAccount] || [];
        // Sort by date
        return accountTrans.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [selectedAccount]);

    // Calculate Running Balance
    let runningBalance = 0;
    const transactionsWithBalance = transactions.map(t => {
        if (t.type === 'Debit') {
            runningBalance += t.amount;
        } else {
            runningBalance -= t.amount;
        }
        return { ...t, balance: runningBalance };
    });

    const totalDebits = transactions.reduce((acc, t) => t.type === 'Debit' ? acc + t.amount : acc, 0);
    const totalCredits = transactions.reduce((acc, t) => t.type === 'Credit' ? acc + t.amount : acc, 0);

    return (
        <div className="ledger-container">
            <div className="ledger-header">
                <div className="ledger-title-section">

                    <div className="account-selector">
                        <select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            className="account-select"
                        >
                            {accounts.map(acc => (
                                <option key={acc} value={acc}>{acc}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="ledger-controls">
                    <div className="date-filters">
                        <input
                            type="date"
                            className="date-input"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                        <span className="separator">to</span>
                        <input
                            type="date"
                            className="date-input"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                    <button className="btn-print">🖨️ Print</button>
                    <button className="btn-export">📥 Export</button>
                </div>
            </div>

            <div className="metrics-grid">
                <div className="metric-card debit">
                    <span className="metric-label">Total Debit</span>
                    <span className="metric-value">${totalDebits.toLocaleString()}</span>
                </div>
                <div className="metric-card credit">
                    <span className="metric-label">Total Credit</span>
                    <span className="metric-value">${totalCredits.toLocaleString()}</span>
                </div>
                <div className="metric-card bal">
                    <span className="metric-label">Closing Balance</span>
                    <span className="metric-value">${runningBalance.toLocaleString()}</span>
                </div>
            </div>

            <div className="ledger-table-wrapper">
                <table className="ledger-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Particulars</th>
                            <th>Vch No.</th>
                            <th>Debit ($)</th>
                            <th>Credit ($)</th>
                            <th>Balance ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionsWithBalance.length > 0 ? (
                            transactionsWithBalance.map((tr) => (
                                <tr key={tr.id}>
                                    <td>{new Date(tr.date).toLocaleDateString()}</td>
                                    <td className="particular-cell">{tr.particular}</td>
                                    <td>{tr.vchNo || '-'}</td>
                                    <td className="debit-cell">{tr.type === 'Debit' ? tr.amount.toLocaleString() : '-'}</td>
                                    <td className="credit-cell">{tr.type === 'Credit' ? tr.amount.toLocaleString() : '-'}</td>
                                    <td className="balance-cell">{tr.balance.toLocaleString()} {tr.balance >= 0 ? 'Dr' : 'Cr'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">No transactions found for this account.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Ledger;

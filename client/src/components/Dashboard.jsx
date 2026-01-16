import { useState } from 'react';
import DayBook from './DayBook';
import './Dashboard.css';

function Dashboard({ onLogout }) {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [showSettings, setShowSettings] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: '📊' },
        { name: 'Day Book', icon: '📖' },
        { name: 'Ledger', icon: '📋' },
        { name: 'Balance Sheet', icon: '📄' },
        { name: 'Employees', icon: '👥' },
        { name: 'Licmome', icon: '💰' },
        { name: 'Elite', icon: '⭐' },
        { name: 'Notifications', icon: '🔔' }
    ];

    const transactions = [
        { date: '03. Feb. 20', description: 'Bat Place', amount: '$7,200', type: 'Income' },
        { date: '25. Jan. 20', description: 'Dat. Monax', amount: '$5,500', type: 'Expense' },
        { date: '01. Oct. 20', date: '01. Oct. 20', description: 'Fraeldipames', amount: '$9,000', type: 'Expense' },
        { date: '28. Mar. 2020', description: 'Bood Gillitis', amount: '$8,000', type: 'Income' }
    ];

    const alerts = [
        { name: 'Bilta Ahmed', date: 'Report: 17, 01, 2003' },
        { name: 'Antimo Clice', date: 'Report: 11, 08, 2009' },
        { name: 'Lex Ali', date: 'Report: 11, 08, 2009' }
    ];

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">
                            <span className="logo-bars"></span>
                        </div>
                        <span className="logo-text">Doha ERP</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
                            onClick={() => setActiveMenu(item.name)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="settings-button"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <span className="nav-icon">⚙️</span>
                        <span className="nav-text">Settings</span>
                        <span className="dropdown-icon">{showSettings ? '▲' : '▼'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {activeMenu === 'Day Book' ? (
                    <DayBook />
                ) : (
                    <>
                        {/* Header */}
                        <header className="dashboard-header">
                            <div className="header-left">
                                <h1 className="page-title">{activeMenu}</h1>
                            </div>
                            <div className="header-right">
                                <button className="header-button">
                                    <span className="icon">⚠️</span>
                                    <span>Enspees</span>
                                    <span className="dropdown-icon">▼</span>
                                </button>
                                <button className="header-button notification-btn">
                                    <span className="icon">🔔</span>
                                    <span className="notification-badge">3</span>
                                </button>
                                <button className="header-button user-btn" onClick={onLogout}>
                                    <span className="icon">👤</span>
                                    <span>Admin</span>
                                    <span className="dropdown-icon">▼</span>
                                </button>
                            </div>
                        </header>

                        {activeMenu === 'Dashboard' && (
                            <>
                                {/* Metrics Cards */}
                                <div className="metrics-grid">
                                    <div className="metric-card">
                                        <div className="metric-label">Total Income</div>
                                        <div className="metric-value">$12,500</div>
                                        <div className="metric-change positive">+1,200</div>
                                    </div>
                                    <div className="metric-card">
                                        <div className="metric-label">Total Expense</div>
                                        <div className="metric-value expense">$7,200</div>
                                        <div className="metric-change negative">-1,025</div>
                                    </div>
                                    <div className="metric-card">
                                        <div className="metric-label">Current Balance</div>
                                        <div className="metric-value balance">$5,300</div>
                                        <div className="metric-change positive">+175</div>
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="content-grid">
                                    {/* Recent Transactions */}
                                    <div className="card transactions-card">
                                        <h2 className="card-title">Recent Transactions</h2>
                                        <div className="table-container">
                                            <table className="transactions-table">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Description</th>
                                                        <th>Amount</th>
                                                        <th>Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transactions.map((transaction, index) => (
                                                        <tr key={index}>
                                                            <td>{transaction.date}</td>
                                                            <td>{transaction.description}</td>
                                                            <td className="amount">{transaction.amount}</td>
                                                            <td>
                                                                <span className={`badge ${transaction.type.toLowerCase()}`}>
                                                                    {transaction.type}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Alerts */}
                                    <div className="card alerts-card">
                                        <h2 className="card-title">Alerts</h2>
                                        <div className="alerts-list">
                                            {alerts.map((alert, index) => (
                                                <div key={index} className="alert-item">
                                                    <div className="alert-avatar">
                                                        {alert.name.charAt(0)}
                                                    </div>
                                                    <div className="alert-info">
                                                        <div className="alert-name">{alert.name}</div>
                                                        <div className="alert-date">{alert.date}</div>
                                                    </div>
                                                    {index === alerts.length - 1 && (
                                                        <button className="alert-menu">⋯</button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeMenu !== 'Dashboard' && activeMenu !== 'Day Book' && (
                            <div className="placeholder-content">
                                <h2>Coming Soon</h2>
                                <p>The {activeMenu} module is under development.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;

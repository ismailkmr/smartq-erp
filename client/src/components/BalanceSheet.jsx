import './BalanceSheet.css';

function BalanceSheet() {
    const balanceSheetData = {
        assets: [
            { name: 'Cash & Bank', amount: '$45,000' },
            { name: 'Accounts Receivable', amount: '$28,500' },
            { name: 'Inventory', amount: '$65,200' },
            { name: 'Fixed Assets', amount: '$125,000' },
            { name: 'Equipment', amount: '$48,750' }
        ],
        liabilities: [
            { name: 'Accounts Payable', amount: '$32,100' },
            { name: 'Short-term Loans', amount: '$25,000' },
            { name: 'Accrued Expenses', amount: '$15,400' },
            { name: 'Long-term Debt', amount: '$50,000' }
        ],
        equity: [
            { name: 'Share Capital', amount: '$100,000' },
            { name: 'Retained Earnings', amount: '$168,950' }
        ]
    };

    const totalAssets = 312450;
    const totalLiabilities = 122500;
    const totalEquity = 268950;

    return (
        <div className="balance-sheet-container">
            <div className="balance-sheet-header">
                <h2 className="sheet-title">Balance Sheet - January 2026</h2>
                <p className="sheet-subtitle">Assets = Liabilities + Equity</p>
            </div>

            <div className="balance-sheet-grid">
                {/* Assets Section */}
                <div className="sheet-section assets-section">
                    <h3 className="section-title">Assets</h3>
                    <div className="items-list">
                        {balanceSheetData.assets.map((item, index) => (
                            <div key={index} className="item-row">
                                <span className="item-name">{item.name}</span>
                                <span className="item-amount">{item.amount}</span>
                            </div>
                        ))}
                    </div>
                    <div className="total-row">
                        <span className="total-label">Total Assets</span>
                        <span className="total-amount">${totalAssets.toLocaleString()}</span>
                    </div>
                </div>

                {/* Liabilities & Equity Section */}
                <div className="sheet-section liabilities-section">
                    {/* Liabilities */}
                    <div>
                        <h3 className="section-title">Liabilities</h3>
                        <div className="items-list">
                            {balanceSheetData.liabilities.map((item, index) => (
                                <div key={index} className="item-row">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-amount">{item.amount}</span>
                                </div>
                            ))}
                        </div>
                        <div className="subtotal-row">
                            <span className="subtotal-label">Total Liabilities</span>
                            <span className="subtotal-amount">${totalLiabilities.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Equity */}
                    <div className="equity-divider">
                        <h3 className="section-title">Equity</h3>
                        <div className="items-list">
                            {balanceSheetData.equity.map((item, index) => (
                                <div key={index} className="item-row">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-amount">{item.amount}</span>
                                </div>
                            ))}
                        </div>
                        <div className="subtotal-row">
                            <span className="subtotal-label">Total Equity</span>
                            <span className="subtotal-amount">${totalEquity.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Total Liabilities + Equity */}
                    <div className="total-row">
                        <span className="total-label">Total Liabilities + Equity</span>
                        <span className="total-amount">${(totalLiabilities + totalEquity).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="summary-cards">
                <div className="summary-card">
                    <div className="summary-label">Total Assets</div>
                    <div className="summary-value">${totalAssets.toLocaleString()}</div>
                </div>
                <div className="summary-card">
                    <div className="summary-label">Total Liabilities</div>
                    <div className="summary-value">${totalLiabilities.toLocaleString()}</div>
                </div>
                <div className="summary-card">
                    <div className="summary-label">Total Equity</div>
                    <div className="summary-value">${totalEquity.toLocaleString()}</div>
                </div>
                <div className="summary-card balance">
                    <div className="summary-label">Balance Check</div>
                    <div className="summary-value">${(totalAssets - (totalLiabilities + totalEquity)).toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}

export default BalanceSheet;

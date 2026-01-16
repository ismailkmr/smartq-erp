import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple validation
        if (email && password) {
            onLogin();
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo">
                        <div className="logo-icon">
                            <span className="logo-bars"></span>
                        </div>
                        <span className="logo-text">Doha ERP</span>
                    </div>
                    <h1 className="login-title">Login to your account</h1>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="mathionne@roallife.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="FNILM1"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? '🔓' : '🔒'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>

                    <div className="login-footer">
                        <a href="#" className="forgot-password">Forgot password?</a>
                        <div className="signup-link">
                            Don't have an account? <a href="#">Create account</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;

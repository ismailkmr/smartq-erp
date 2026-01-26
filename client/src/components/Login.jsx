import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/logo.png';
import API_URL from '../config';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('abc@qwe.com');
    const [password, setPassword] = useState('123456');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLogin();
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again later.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo">
                        <img src={logo} alt="Doha ERP Logo" className="logo-img" />
                        <span className="logo-text">Doha ERP</span>
                    </div>
                    <h1 className="login-title">Login to your account</h1>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
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

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="login-footer">
                        <a href="#" className="forgot-password">Forgot password?</a>
                        <div className="signup-link">
                            Don't have an account? <Link to="/register">Create account</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;

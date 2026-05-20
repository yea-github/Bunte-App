import { useMemo, useState } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/login';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tokenResponse, setTokenResponse] = useState(() => {
    const savedToken = localStorage.getItem('bunte_access_token');
    return savedToken ? { access_token: savedToken } : null;
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  const bearerToken = tokenResponse?.access_token || '';
  const tokenPreview = useMemo(() => {
    if (!bearerToken) {
      return '';
    }

    return `${bearerToken.slice(0, 28)}...${bearerToken.slice(-18)}`;
  }, [bearerToken]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setTokenResponse(null);
    setCopyStatus('');
    localStorage.removeItem('bunte_access_token');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error_description || data.error || 'Login failed. Please check your username and password.');
        return;
      }

      setTokenResponse(data);
      localStorage.setItem('bunte_access_token', data.access_token);
    } catch (loginError) {
      setError('Could not reach the authentication server. Please make sure the backend and Keycloak are running.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setPassword('');
    setTokenResponse(null);
    setError('');
    setCopyStatus('');
    localStorage.removeItem('bunte_access_token');
  }

  async function handleCopyToken() {
    if (!bearerToken) {
      return;
    }

    await navigator.clipboard.writeText(`Bearer ${bearerToken}`);
    setCopyStatus('Bearer token copied.');
  }

  return (
    <div className="App">
      <main className="login-page">
        <section className="login-panel" aria-labelledby="login-title">
          <div className="brand-block">
            <p className="eyebrow">Bunte App</p>
            <h1 id="login-title">Sign in</h1>
            <p className="intro">Use your Keycloak account to receive a Bearer token for authenticated API calls.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="testuser"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              required
            />

            {error && <p className="message error">{error}</p>}

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Login with Keycloak'}
            </button>
          </form>

          {bearerToken && (
            <section className="token-panel" aria-label="Bearer token">
              <div>
                <p className="token-label">Authenticated</p>
                <p className="token-value">Bearer {tokenPreview}</p>
                {copyStatus && <p className="copy-status">{copyStatus}</p>}
              </div>
              <div className="token-actions">
                <button className="secondary-button" type="button" onClick={handleCopyToken}>
                  Copy token
                </button>
                <button className="secondary-button" type="button" onClick={handleLogout}>
                  Clear token
                </button>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

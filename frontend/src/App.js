import { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
const TOKEN_STORAGE_KEY = 'bunte_access_token';

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '='
    );

    return JSON.parse(atob(paddedPayload));
  } catch (decodeError) {
    return null;
  }
}

function getUserProfile(token) {
  const claims = decodeJwtPayload(token) || {};

  return {
    firstName: claims.given_name || claims.first_name || '',
    lastName: claims.family_name || claims.last_name || '',
    username: claims.preferred_username || claims.username || claims.sub || '',
  };
}

function navigateTo(path) {
  window.history.pushState({}, '', path);
  const navigationEvent = typeof PopStateEvent === 'function' ? new PopStateEvent('popstate') : new Event('popstate');
  window.dispatchEvent(navigationEvent);
}

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tokenResponse, setTokenResponse] = useState(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    return savedToken ? { access_token: savedToken } : null;
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [dashboardItems, setDashboardItems] = useState([]);
  const [dashboardError, setDashboardError] = useState('');
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  const bearerToken = tokenResponse?.access_token || '';
  const userProfile = useMemo(() => {
    if (!bearerToken) {
      return null;
    }

    return getUserProfile(bearerToken);
  }, [bearerToken]);

  useEffect(() => {
    function handleLocationChange() {
      setCurrentPath(window.location.pathname);
    }

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (bearerToken && currentPath !== '/home') {
      navigateTo('/home');
    }

    if (!bearerToken && currentPath === '/home') {
      navigateTo('/');
    }
  }, [bearerToken, currentPath]);

  useEffect(() => {
    if (!bearerToken) {
      setDashboardItems([]);
      setDashboardError('');
      setIsDashboardLoading(false);
      return;
    }

    let isActive = true;

    async function fetchDashboardItems() {
      setDashboardError('');
      setIsDashboardLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Dashboard request failed.');
        }

        const data = await response.json();

        if (isActive) {
          setDashboardItems(data);
        }
      } catch (dashboardFetchError) {
        if (isActive) {
          setDashboardItems([]);
          setDashboardError('Could not load dashboard menu items.');
        }
      } finally {
        if (isActive) {
          setIsDashboardLoading(false);
        }
      }
    }

    fetchDashboardItems();

    return () => {
      isActive = false;
    };
  }, [bearerToken]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setTokenResponse(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
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
      localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      navigateTo('/home');
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
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    navigateTo('/');
  }

  if (bearerToken) {
    return (
      <div className="App">
        <main className="home-page">
          <section className="home-panel" aria-labelledby="home-title">
            <div className="home-header">
              <div>
                <p className="eyebrow">Bunte App</p>
                <h1 id="home-title">Home Page</h1>
              </div>
              <button className="secondary-button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className="welcome-block">
              <p className="intro">You are successfully logged in.</p>
              <dl className="user-details" aria-label="Logged in user details">
                <div>
                  <dt>First name</dt>
                  <dd>{userProfile?.firstName || 'Not available'}</dd>
                </div>
                <div>
                  <dt>Last name</dt>
                  <dd>{userProfile?.lastName || 'Not available'}</dd>
                </div>
                <div>
                  <dt>User name</dt>
                  <dd>{userProfile?.username || 'Not available'}</dd>
                </div>
              </dl>
            </div>

            <section className="dashboard-menu" aria-labelledby="dashboard-menu-title">
              <div className="section-heading">
                <p className="eyebrow">Dashboard</p>
                <h2 id="dashboard-menu-title">Menu</h2>
              </div>

              {isDashboardLoading && <p className="menu-status">Loading dashboard items...</p>}
              {dashboardError && <p className="message error">{dashboardError}</p>}

              {!isDashboardLoading && !dashboardError && (
                <ul className="dashboard-grid" aria-label="Dashboard menu items">
                  {dashboardItems.map((item) => (
                    <li key={item.name} className="dashboard-tile">
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </section>
        </main>
      </div>
    );
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
        </section>
      </main>
    </div>
  );
}

export default App;

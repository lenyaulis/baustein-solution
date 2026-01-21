// src/components/auth/AuthGate.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../firebase/client';

function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setError('Не удалось войти. Проверь логин и пароль.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  if (initializing) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f3f4f6',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          padding: 16,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 360,
            padding: 20,
            borderRadius: 12,
            background: '#ffffff',
            boxShadow: '0 10px 30px rgba(15,23,42,0.12)',
          }}
        >
          <h1
            style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Бауштайн.Решения
          </h1>
          <p
            style={{
              margin: 0,
              marginBottom: 16,
              fontSize: 13,
              color: '#6b7280',
            }}
          >
            Вход в рабочий кабинет
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  fontSize: 12,
                  color: '#b91c1c',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                marginTop: 4,
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: 'none',
                background: '#1d4ed8',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Войти
            </button>
          </form>

          <p
            style={{
              marginTop: 12,
              fontSize: 11,
              color: '#9ca3af',
            }}
          >
            Данные для входа выдает администратор.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 8,
          right: 8,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <span
          style={{
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 999,
            background: '#e5e7eb',
            color: '#374151',
          }}
        >
          {user.email}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 999,
            border: 'none',
            background: '#f97316',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Выйти
        </button>
      </div>

      {children}
    </>
  );
}

export default AuthGate;

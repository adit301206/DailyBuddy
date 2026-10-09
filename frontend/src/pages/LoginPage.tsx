import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both your username and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login({ username: username.trim(), password });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div
          className="rounded-2xl border p-8 shadow-xl transition-all"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl mb-4 shadow-sm select-none"
              style={{
                backgroundColor: 'var(--color-primary-soft)',
                color: 'var(--color-primary)',
              }}
            >
              D
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
              DailyBuddy
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Private Workspace &amp; Focus Tracker
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                backgroundColor: 'var(--color-danger-soft)',
                color: 'var(--color-danger)',
                border: '1px solid var(--color-danger)',
              }}
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Owner Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-text-secondary)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Notice */}
          <div
            className="mt-8 pt-6 border-t flex items-center justify-center gap-2 text-xs font-medium"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <span>Single-Owner Protected Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-night-500 bg-star-pattern flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brass-500/10 border border-brass-500/30 mb-4">
            <Moon className="w-8 h-8 text-brass-400" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-4xl text-ivory tracking-wide">Al-Manarah</h1>
          <p className="text-night-200 font-body text-sm mt-2 tracking-widest uppercase">Mosque Management System</p>
        </div>

        <div className="arch-top bg-ivory shadow-2xl px-8 pt-16 pb-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-brass-500 flex items-center justify-center shadow-lg">
            <span className="font-display text-ivory text-2xl">ا</span>
          </div>
          <h2 className="font-display text-2xl text-night-600 text-center mb-6">Welcome back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-night-100 bg-white focus:outline-none focus:ring-2 focus:ring-brass-400/50 focus:border-brass-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-night-100 bg-white focus:outline-none focus:ring-2 focus:ring-brass-400/50 focus:border-brass-400 transition"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-night-500 hover:bg-night-600 text-ivory font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-night-300 mt-6">
            Demo credentials — admin / admin12345
          </p>
        </div>
      </div>
    </div>
  );
}

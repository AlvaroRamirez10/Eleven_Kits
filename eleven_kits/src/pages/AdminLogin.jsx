import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import supabase from '../supabaseClient';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError('Email o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    navigate('/admin');
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#0A0A0A',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#F5F5F0',
    fontSize: '14px',
    marginBottom: '14px',
    outline: 'none',
  };

  return (
    <div style={{
      backgroundColor: '#0A0A0A',
      minHeight: '100vh',
      color: '#F5F5F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#1C1C1C',
          border: '1px solid #262626',
          padding: '36px 32px',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '340px',
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 213, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Lock color="#FFD500" size={22} />
        </div>

        <p style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '13px',
          letterSpacing: '2px',
          color: '#8A8A8A',
          textAlign: 'center',
          marginBottom: '4px',
        }}>
          ELEVEN KITS
        </p>

        <h1 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '20px',
          letterSpacing: '1px',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          ACCESO ADMIN
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && (
          <p style={{
            color: '#FF6B6B',
            fontSize: '13px',
            backgroundColor: '#2A1414',
            padding: '10px 12px',
            borderRadius: '4px',
            marginBottom: '14px',
          }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#FFD500',
            color: '#0A0A0A',
            border: 'none',
            padding: '13px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
import { useState } from 'react';
import { supabase } from '../supabase';
// Supondo que você está usando react-router-dom para navegação
import { useNavigate } from 'react-router-dom'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirecionar o usuário

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      // 1. Verificamos o erro primeiro (boa prática)
      if (error) {
        throw error;
      }
      
      // 2. AGORA USAMOS A VARIÁVEL 'data' para confirmar o sucesso!
      // Se o login foi bem-sucedido, data.user conterá as informações do usuário.
      if (data.user) {
        // Redireciona o usuário para o painel principal após o login.
        // O AuthProvider que criamos antes irá detectar a mudança e atualizar a UI.
        navigate('/dashboard'); 
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Acesse sua Conta</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Login'}
        </button>
      </form>
      
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
    </div>
  );
}

export default Login;

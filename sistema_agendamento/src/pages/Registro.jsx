// src/pages/Registro.jsx
import { useState } from 'react';
import { supabase } from '../supabase'; // Importe seu cliente Supabase configurado

function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Função executada quando o formulário é enviado
  const handleRegister = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Usa a função signUp do Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw error; // Joga o erro para o bloco catch
      }
      
      // Por padrão, o Supabase envia um e-mail de confirmação.
      // Você pode desabilitar isso nas configurações do seu projeto Supabase para facilitar os testes.
      if (data) {
        setSuccess(true);
        setEmail('');
        setPassword('')
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crie sua Conta</h2>
      <form onSubmit={handleRegister}>
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
          {loading ? 'Criando...' : 'Registrar'}
        </button>
      </form>
      
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      {success && <p style={{ color: 'green' }}>Sucesso! Verifique seu e-mail para confirmar a conta.</p>}
    </div>
  );
}

export default Registro;

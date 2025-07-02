// src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h1>Bem-vindo à Barbearia!</h1>
      <p>Agende seu horário de forma fácil, com ou sem cadastro.</p>

      <button
        style={{
          padding: '1em 2em',
          fontSize: '1.2em',
          margin: '1em',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/agendar')}
      >
        Agendar serviço sem cadastro
      </button>

      <div style={{ marginTop: '2em' }}>
        <button onClick={() => navigate('/login')} style={{ marginRight: '10px' }}>
          Entrar
        </button>
        <button onClick={() => navigate('/registro')}>
          Criar conta
        </button>
      </div>
    </div>
  );
}

export default HomePage;
// src/App.jsx
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';

function App() {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div>
        <h1>Bem-vindo, {user.email}!</h1>
        <button onClick={signOut}>Sair</button>
        {/* Aqui você renderizaria o painel principal da aplicação */}
      </div>
    );
  }

  return (
    <div>
      <h1>Bem-vindo ao Sistema de Agendamento</h1>
      <Registro />
      <hr />
      <Login />
      <hr/>
    </div>
  );
}

export default App;
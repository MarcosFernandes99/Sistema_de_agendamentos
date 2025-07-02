// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importe suas páginas e componentes
import LoginPage from './pages/Login';
import RegistroPage from './pages/Registro';
import DashboardPage from './pages/Dashboard';
import AgendamentoPage from './pages/AgendamentoPage';
import MeusAgendamentosPage from './pages/MeusAgendamentos';
import GerenciarServicosPage from './pages/GerenciarServicos';
import ProtectedRoute from './pages/ProtectedRoute';
import HomePage from './pages/HomePage';

function App() {
  return (
  <div>
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
        {/* <Link to="/" style={{ marginRight: '10px' }}>Login</Link> */}
        {/* <Link to="/registro" style={{ marginRight: '10px' }}>Registro</Link> */}
        <Link to="/" style={{ marginRight: '10px' }}>Início</Link>
        <Link to="/agendar" style={{ marginRight: '10px' }}>Fazer Agendamento</Link>
        <Link to="/meus-agendamentos" style={{ marginRight: '10px' }}>Meus Agendamentos</Link>
        <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard (Admin)</Link>
        <Link to="/admin/servicos">Gerenciar Serviços (Admin)</Link>
      </nav>
      <hr />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/registro" element={<RegistroPage />} />

        {/* Rotas Protegidas */}
        <Route path="/agendar" element={<AgendamentoPage/>} />
        <Route path="/meus-agendamentos" element={<ProtectedRoute><MeusAgendamentosPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin/servicos" element={<ProtectedRoute><GerenciarServicosPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
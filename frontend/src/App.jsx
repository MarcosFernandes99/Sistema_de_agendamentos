// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// Importe APENAS as páginas que você vai usar nas rotas
import LoginPage from './pages/Login';
import RegistroPage from './pages/Registro';
import DashboardPage from './pages/Dashboard';
import AgendamentoPage from './pages/AgendamentoPage';
import MeusAgendamentosPage from './pages/MeusAgendamentos';
import GerenciarServicosPage from './pages/GerenciarServicos';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
   
     <div>
      <nav>
        <Link to="/">Login</Link> | <Link to="/registro">Registro</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
      <hr />

      {/* ... (suas rotas) ... */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/agendar" element={<ProtectedRoute><AgendamentoPage /></ProtectedRoute>} />
        <Route path="/meus-agendamentos" element={<ProtectedRoute><MeusAgendamentosPage /></ProtectedRoute>} />
        <Route path="/admin/servicos" element={<ProtectedRoute><GerenciarServicosPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
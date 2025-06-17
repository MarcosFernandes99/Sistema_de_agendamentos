// src/App.jsx

import React from 'react';
// 1. Importe os componentes de roteamento
import { Routes, Route } from 'react-router-dom';

// 2. Importe TODAS as suas páginas
import LoginPage from './pages/Login'; // Supondo que você renomeou Login.jsx para LoginPage.jsx
import RegistroPage from './pages/Registro'; // E Registro.jsx para RegistroPage.jsx
import AgendamentoPage from './pages/AgendamentoPage';
import MeusAgendamentosPage from './pages/MeusAgendamentos';
import Dashboard from './pages/Dashboard';
// import NotFoundPage from './pages/NotFoundPage'; // Uma página para URLs que não existem

function App() {
  return (
    // O Routes é o gerenciador que olha para a URL e escolhe uma rota da lista[4, 5]
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} /> {/* <-- AQUI ESTÁ ELA! */}
      
      {/* Rotas Privadas (que deveriam ser protegidas) */}
      <Route path="/agendar" element={<AgendamentoPage />} />
      <Route path="/meus-agendamentos" element={<MeusAgendamentosPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Rota para a página inicial (ex: redireciona para o login) */}
      <Route path="/" element={<LoginPage />} />
      
      {/* Rota "Pega-Tudo" para URLs não encontradas */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;

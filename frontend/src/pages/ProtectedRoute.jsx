// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Certifique-se que o caminho para seu AuthContext está correto

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Enquanto o AuthContext ainda está verificando se existe um usuário (pode ser rápido, mas é importante)
  if (loading) {
    return <div>Carregando...</div>; // Ou um componente de spinner/loading mais bonito
  }

  // Se, após a verificação, não houver usuário, redireciona para a página de login
  if (!user) {
    return <Navigate to="/" replace />; // O 'replace' evita que o usuário volte para a página protegida com o botão "voltar" do navegador
  }

  // Se houver um usuário logado, renderiza o componente filho (a página que queremos proteger)
  return children;
}

export default ProtectedRoute;
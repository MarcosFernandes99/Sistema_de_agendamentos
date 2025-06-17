// /src/pages/MeusAgendamentosPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAgendamentosPorCliente } from '../services/agendamentosServices';

function MeusAgendamentosPage() {
  const { user } = useAuth(); // 1. Descobrimos quem está logado
  const [agendamentos, setAgendamentos] = useState([]); // 2. Criamos uma "caixa" vazia para guardar os agendamentos
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. É uma guarda de segurança. Só tentamos buscar os dados se soubermos quem é o usuário.
    if (user) {
      setLoading(true);
      // 4. Chamamos a função de serviço que busca agendamentos PELO ID DO CLIENTE
      getAgendamentosPorCliente(user.id)
        .then(data => {
          setAgendamentos(data); // 5. Quando os dados chegam, colocamos na nossa "caixa"
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false)); // 6. Independentemente do resultado, paramos de carregar
    }
  }, [user]); // 7. Este código roda sempre que o 'user' mudar (ou seja, quando o usuário faz login)

  if (loading) {
    return <div>Carregando seus agendamentos...</div>;
  }

  // JSX para mostrar a lista na tela
  return (
    <div>
      <h1>Meus Agendamentos</h1>
      {agendamentos.length === 0 ? (
        <p>Você ainda não tem nenhum agendamento.</p>
      ) : (
        <ul>
          {agendamentos.map(agendamento => (
            <li key={agendamento.id}>
              <strong>Serviço:</strong> {agendamento.servicos.nome} <br />
              <strong>Data:</strong> {new Date(agendamento.data_hora_inicio).toLocaleString()} <br />
              <strong>Status:</strong> {agendamento.status}
              {/* Aqui você poderia adicionar um botão para cancelar */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeusAgendamentosPage;

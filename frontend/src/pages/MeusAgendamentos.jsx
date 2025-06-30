// /src/pages/MeusAgendamentosPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { agendamentosServices } from '../services/agendamentosServices'; 

function MeusAgendamentosPage() {
  const { user } = useAuth(); // 1. Descobrimos quem está logado
  const [agendamentos, setAgendamentos] = useState([]); // 2. Criamos uma "caixa" vazia para guardar os agendamentos
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. É uma guarda de segurança. Só tentamos buscar os dados se soubermos quem é o usuário.
    if (user) {
      setLoading(true);
      // 4. Chamamos a função de serviço que busca agendamentos PELO ID DO CLIENTE
      agendamentosServices.getAgendamentosPorCliente(user.id)
        .then(data => {
          setAgendamentos(data); // 5. Quando os dados chegam, colocamos na nossa "caixa"
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false)); // 6. Independentemente do resultado, paramos de carregar
    }
  }, [user]); // 7. Este código roda sempre que o 'user' mudar (ou seja, quando o usuário faz login)

  const handleCancelar = async (agendamentoId) => {
    // Opcional: Adicionar uma confirmação.
    if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      return;
    }

    try {
      const agendamentoCancelado = await agendamentosServices.cancelarAgendamento(agendamentoId);
      
      // Atualiza a lista de agendamentos na tela sem precisar recarregar a página.
      setAgendamentos(agendamentosAtuais => 
        agendamentosAtuais.map(ag => 
          ag.id === agendamentoId ? agendamentoCancelado : ag
        )
      );

    } catch (error) {
      alert(error.message);
    }
  };

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
            <li key={agendamento.id} style={{ textDecoration: agendamento.status === 'cancelado' ? 'line-through' : 'none' }}>
              Serviço: {agendamento.servicos.nome} <br />
              Data: {new Date(agendamento.data_hora_inicio).toLocaleString()} <br />
              Status: {agendamento.status} <br />
              
              {/* NOVO: Mostra o botão de cancelar apenas se o agendamento estiver 'confirmado'. */}
              {agendamento.status === 'confirmado' && (
                <button onClick={() => handleCancelar(agendamento.id)}>
                  Cancelar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeusAgendamentosPage;

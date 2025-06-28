// /src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { getAgendamentosPorDia } from '../services/agendamentosServices';

function Dashboard() {
  // 1. O barbeiro precisa de um jeito de escolher o dia que quer ver. Começamos com hoje.
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  // 2. Criamos uma "caixa" vazia para a agenda do dia
  const [agendaDoDia, setAgendaDoDia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 3. Chamamos a OUTRA função de serviço, que busca agendamentos POR DIA
    getAgendamentosPorDia(dataSelecionada)
      .then(data => {
        setAgendaDoDia(data); // 4. Quando os dados chegam, guardamos na nossa "caixa"
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));

  // 5. Este código roda de novo TODA VEZ que o barbeiro muda a data no calendário!
  }, [dataSelecionada]);

  if (loading) {
    return <div>Carregando agenda...</div>;
  }

  // Função para lidar com a mudança de data no input
  const handleDateChange = (e) => {
    const dateString = e.target.value;
    // O input 'date' retorna uma string como "2025-06-15". O new Date precisa de um ajuste de fuso.
    const [year, month, day] = dateString.split('-');
    setDataSelecionada(new Date(year, month - 1, day));
  };
  
  return (
    <div>
      <h1>Agenda do Dia</h1>
      {/* 6. Um calendário para o barbeiro escolher a data */}
      <input 
        type="date"
        // Formata a data para o formato que o input espera (AAAA-MM-DD)
        value={dataSelecionada.toISOString().split('T')[0]} 
        onChange={handleDateChange} 
      />
      
      {/* 7. Mostra a lista de agendamentos para o dia selecionado */}
      {agendaDoDia.length === 0 ? (
        <p>Nenhum agendamento para este dia.</p>
      ) : (
        <ul>
          {agendaDoDia.map(ag => (
            <li key={ag.id}>
              <strong>Horário:</strong> {new Date(ag.data_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
              <strong>Cliente:</strong> {ag.usuarios.nome} <br />
              <strong>Serviço:</strong> {ag.servicos.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;

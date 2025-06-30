// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { getAgendamentosPorDia } from '../services/agendamentosServices'; // Verifique o caminho da importação

function DashboardPage() {
  // Estado para guardar a data selecionada, começando com hoje.
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  // Estado para guardar os agendamentos do dia.
  const [agendaDoDia, setAgendaDoDia] = useState([]);
  // NOVO: Estado de loading para melhor feedback ao usuário.
  const [loading, setLoading] = useState(true);

  // ESTE É O useEffect CORRIGIDO E ÚNICO PARA BUSCAR DADOS
  useEffect(() => {
    console.log("[useEffect Disparado] Buscando dados para a data:", dataSelecionada);
    // Define uma função assíncrona dentro do efeito para buscar os dados.
    const carregarAgenda = async () => {
      // Se por algum motivo a data não estiver definida, não faz nada.
      if (!dataSelecionada) return;

      setLoading(true); // Ativa o indicador de carregamento.
      try {
        const agendamentos = await getAgendamentosPorDia(dataSelecionada);
        console.log("[API Retornou] Agendamentos recebidos:", agendamentos);
        setAgendaDoDia(agendamentos);
      } catch (error) {
        console.error("Erro ao carregar a agenda do dia:", error);
        // Opcional: Mostrar uma mensagem de erro na tela
      } finally {
        setLoading(false); // Desativa o indicador de carregamento, mesmo se der erro.
      }
    };

    carregarAgenda(); // Chama a função para buscar os dados.

  }, [dataSelecionada]); // A MÁGICA: O efeito depende da dataSelecionada.

  // Função para lidar com a mudança de data no input
  const handleDateChange = (e) => {
    // O input 'date' retorna uma string "AAAA-MM-DD". Precisamos convertê-la para um objeto Date.
    // Adicionar T00:00:00 para evitar problemas de fuso horário.
    const novaData = new Date(e.target.value + 'T00:00:00');
    setDataSelecionada(novaData);
  };

  return (
    <div>
      <h1>Agenda do Dia</h1>
      <input 
        type="date"
        value={dataSelecionada.toISOString().split('T')[0]} 
        onChange={handleDateChange} 
      />
      
      {/* Mostra o feedback de carregamento ou a lista de agendamentos */}
      {loading ? (
        <p>Carregando agenda...</p>
      ) : agendaDoDia.length === 0 ? (
        <p>Nenhum agendamento para este dia.</p>
      ) : (
        <ul>
          {agendaDoDia.map(ag => (
            <li key={ag.id}>
              <strong>Horário:</strong> {new Date(ag.data_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
              <strong>Cliente:</strong> {ag.profiles?.nome || 'Cliente não encontrado'} <br />
              <strong>Serviço:</strong> {ag.servicos?.nome || 'Serviço não encontrado'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardPage;

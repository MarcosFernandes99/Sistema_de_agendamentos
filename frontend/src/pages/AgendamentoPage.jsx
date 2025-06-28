// frontend/src/pages/AgendamentoPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getServicos } from '../services/servicosServices';
// NOVO: Importamos a função que busca horários da nossa Edge Function
import { agendamentosService } from '../services/agendamentosServices';

// NOVO: Importamos o componente de calendário e o CSS padrão
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

function AgendamentoPage() {
  const { user } = useAuth();

  // --- Estados do Formulário ---
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(undefined); // ALTERADO: Começa indefinido
  // NOVO: Estados para a lógica de horários
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  
  // --- Estados de Feedback ---
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false); // NOVO: Loading específico para os horários
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Efeito para carregar a lista de serviços
  useEffect(() => {
    getServicos()
      .then(data => setServicos(data))
      .catch(err => setError('Não foi possível carregar os serviços.'))
      .finally(() => setLoadingServicos(false));
  }, []);

  // NOVO: Efeito para buscar os horários disponíveis sempre que a data ou o serviço mudar
  useEffect(() => {
    // Só busca se o usuário já selecionou um serviço E uma data
    if (dataSelecionada && servicoSelecionado) {
      setLoadingHorarios(true);
      setError(null);
      setHorariosDisponiveis([]);
      setHorarioSelecionado('');

      // Formata a data para "YYYY-MM-DD"
      const dataFormatada = dataSelecionada.toISOString().split('T')[0];
      
      agendamentosService.getHorariosDisponiveis(dataFormatada, servicoSelecionado)
        .then(horarios => {
          setHorariosDisponiveis(horarios);
        })
        .catch(err => {
          setError(err.message || "Não foi possível buscar os horários.");
        })
        .finally(() => {
          setLoadingHorarios(false);
        });
    }
  }, [dataSelecionada, servicoSelecionado]);


  // ALTERADO: Função para confirmar o agendamento
  const handleConfirmarAgendamento = async () => {
    if (!servicoSelecionado || !dataSelecionada || !horarioSelecionado) {
      setError('Por favor, selecione um serviço, uma data e um horário.');
      return;
    }

    // Combina a data selecionada com o horário selecionado
    const [horas, minutos] = horarioSelecionado.split(':');
    const dataHoraFinal = new Date(dataSelecionada);
    dataHoraFinal.setHours(horas, minutos, 0, 0);

    setError(null);
    setSuccess('');

    try {
      // Chama a função RPC 'agendar_horario' que criamos
      const novoAgendamento = await agendamentosService.createAgendamento({
        cliente_id: user.id,
        servico_id: servicoSelecionado,
        data_hora_inicio: dataHoraFinal.toISOString(),
      });
      
      const dataConfirmada = new Date(novoAgendamento.data_hora_inicio);
      
      setSuccess(`Agendamento #${novoAgendamento.id} confirmado para ${dataConfirmada.toLocaleString()}!`);
      // Limpa os campos
      setDataSelecionada(undefined);
      setHorarioSelecionado('');
      setHorariosDisponiveis([]);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Faça seu Agendamento</h1>
      
      {/* 1. Seletor de Serviço */}
      <select value={servicoSelecionado} onChange={(e) => setServicoSelecionado(e.target.value)} disabled={loadingServicos}>
        <option value="">Selecione um serviço</option>
        {servicos.map(servico => (
          <option key={servico.id} value={servico.id}>{servico.nome}</option>
        ))}
      </select>

      {/* 2. Seletor de Data (Calendário) */}
      <div style={{ marginTop: '20px' }}>
        <DayPicker
          mode="single"
          selected={dataSelecionada}
          onSelect={setDataSelecionada}
          fromDate={new Date()} // Impede que o usuário selecione datas passadas
        />
      </div>

      {/* 3. Seção de Horários Disponíveis */}
      {loadingHorarios && <p>Buscando horários...</p>}
      {!loadingHorarios && horariosDisponiveis.length > 0 && (
        <div>
          <h3>Selecione um horário:</h3>
          {horariosDisponiveis.map(horario => (
            <button 
              key={horario} 
              onClick={() => setHorarioSelecionado(horario)}
              style={{ fontWeight: horario === horarioSelecionado ? 'bold' : 'normal', margin: '5px' }}
            >
              {horario}
            </button>
          ))}
        </div>
      )}

      {/* Botão para confirmar */}
      <button onClick={handleConfirmarAgendamento} style={{ marginTop: '20px' }}>
        Confirmar Agendamento
      </button>

      {/* Área para mostrar as mensagens de feedback */}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default AgendamentoPage;
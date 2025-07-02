// frontend/src/pages/AgendamentoPage.jsx
import { supabase } from '../supabase';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getServicos } from '../services/servicosServices';
import { agendamentosServices } from '../services/agendamentosServices';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

function AgendamentoPage() {
  const { user } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(undefined);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const hasStartedAnonymous = useRef(false); // Evita múltiplas chamadas de autenticação

  // Autenticação anônima ao entrar na página
  useEffect(() => {
    if (!user && !hasStartedAnonymous.current) {
      hasStartedAnonymous.current = true;
      supabase.auth.signInAnonymously()
        .catch(error => {
          setError('Falha ao criar sessão temporária: ' + error.message);
        });
    }
  }, [user]);

  // Buscar serviços após autenticação
  useEffect(() => {
    const fetchServicos = async () => {
      if (user) { // Só busca se temos um usuário (autenticado ou anônimo)
        try {
          setLoadingServicos(true);
          const data = await getServicos();
          setServicos(data);
        } catch (err) {
          setError('Não foi possível carregar os serviços.');
        } finally {
          setLoadingServicos(false);
        }
      }
    };

    fetchServicos();
  }, [user]); // Dependência do user

  // Buscar horários disponíveis
  useEffect(() => {
    const fetchHorarios = async () => {
      if (dataSelecionada && servicoSelecionado) {
        setLoadingHorarios(true);
        setError(null);
        setHorariosDisponiveis([]);
        setHorarioSelecionado('');

        try {
          const dataFormatada = dataSelecionada.toISOString().split('T')[0];
          const horarios = await agendamentosServices.getHorariosDisponiveis(
            dataFormatada, 
            servicoSelecionado
          );
          setHorariosDisponiveis(horarios);
        } catch (err) {
          setError(err.message || "Não foi possível buscar os horários.");
        } finally {
          setLoadingHorarios(false);
        }
      }
    };

    fetchHorarios();
  }, [dataSelecionada, servicoSelecionado]);

  // Confirmar agendamento
  const handleConfirmarAgendamento = async () => {
    if (!servicoSelecionado || !dataSelecionada || !horarioSelecionado) {
      setError('Por favor, selecione um serviço, uma data e um horário.');
      return;
    }

    setError(null);
    setSuccess('');

    try {
      let currentUser = user;
      
      // Se necessário, cria usuário anônimo (deveria já existir)
      if (!currentUser) {
        const { data: { user: anonymousUser }, error: authError } = 
          await supabase.auth.signInAnonymously();
        
        if (authError) throw new Error("Falha ao criar sessão anônima");
        currentUser = anonymousUser;
      }

      // Combina data e horário
      const [horas, minutos] = horarioSelecionado.split(':');
      const dataHoraFinal = new Date(dataSelecionada);
      dataHoraFinal.setHours(horas, minutos, 0, 0);

      // Cria agendamento
      const novoAgendamento = await agendamentosServices.createAgendamento({
        cliente_id: currentUser.id,
        servico_id: servicoSelecionado,
        data_hora_inicio: dataHoraFinal.toISOString(),
      });

      const dataConfirmada = new Date(novoAgendamento.data_hora_inicio);
      setSuccess(`Agendamento #${novoAgendamento.id} confirmado para ${dataConfirmada.toLocaleString()}!`);
      
      // Limpa os campos
      setServicoSelecionado('');
      setDataSelecionada(undefined);
      setHorarioSelecionado('');
      setHorariosDisponiveis([]);

    } catch (err) {
      setError(err.message);
    }
  };

  // Renderização condicional para sessão
  if (!user) {
    return <p>Iniciando sessão temporária...</p>;
  }

  return (
    <div>
      <h1>Faça seu Agendamento</h1>
      
      {/* Seletor de Serviço */}
      <select 
        value={servicoSelecionado} 
        onChange={(e) => setServicoSelecionado(e.target.value)} 
        disabled={loadingServicos}
      >
        <option value="">Selecione um serviço</option>
        {servicos.map(servico => (
          <option key={servico.id} value={servico.id}>
            {servico.nome}
          </option>
        ))}
      </select>

      {/* Calendário */}
      <div style={{ marginTop: '20px' }}>
        <DayPicker
          mode="single"
          selected={dataSelecionada}
          onSelect={setDataSelecionada}
          fromDate={new Date()}
        />
      </div>

      {/* Horários Disponíveis */}
      {loadingHorarios && <p>Buscando horários...</p>}
      {!loadingHorarios && horariosDisponiveis.length > 0 && (
        <div>
          <h3>Selecione um horário:</h3>
          {horariosDisponiveis.map(horario => (
            <button 
              key={horario} 
              onClick={() => setHorarioSelecionado(horario)}
              style={{ 
                fontWeight: horario === horarioSelecionado ? 'bold' : 'normal',
                margin: '5px',
                padding: '8px 12px',
                backgroundColor: horario === horarioSelecionado ? '#f0f0f0' : '#fff'
              }}
            >
              {horario}
            </button>
          ))}
        </div>
      )}

      {/* Botão de confirmação */}
      <button 
        onClick={handleConfirmarAgendamento} 
        style={{ 
          marginTop: '20px',
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Confirmar Agendamento
      </button>

      {/* Mensagens de feedback */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>Erro: {error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
    </div>
  );
}

export default AgendamentoPage;
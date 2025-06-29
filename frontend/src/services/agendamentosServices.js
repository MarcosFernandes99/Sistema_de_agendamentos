import { supabase } from '../supabase';

async function getHorariosDisponiveis(data, servicoId) {
  const { data: result, error } = await supabase.functions.invoke('get-horarios-disponiveis', {
    body: { data, servicoId },
  });

  if (error) {
    console.error("Erro no serviço ao buscar horários:", error);
    throw new Error(error.message);
  }

  // A nossa Edge Function retorna { horarios: [...] }, então pegamos essa propriedade
  return result.horarios;
}


export const createAgendamento = async (agendamentoData) => {
  const { cliente_id, servico_id, data_hora_inicio } = agendamentoData;

  // Chama a nossa nova função RPC no Supabase, passando os parâmetros.
  const { data: novoAgendamento, error } = await supabase.rpc('agendar_horario', {
    p_cliente_id: cliente_id,
    p_servico_id: servico_id,
    p_data_hora_inicio: data_hora_inicio
  });

  if (error) {
    console.error('Erro ao criar agendamento:', error.message);
    // O erro vindo do Supabase será a mensagem que definimos, como "Este horário já está ocupado."
    throw new Error(error.message);
  }

  return novoAgendamento;
};

export const getAgendamentosPorCliente = async (clienteId) => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      id,
      data_hora_inicio,
      status,
      servicos ( nome, preco ) 
    `)
    // O filtro crucial: onde a coluna 'cliente_id' for igual ao ID que passamos.
    .eq('cliente_id', clienteId)
    // Ordena os resultados para mostrar os mais recentes primeiro.
    .order('data_hora_inicio', { ascending: false });

  if (error) {
    console.error('Erro ao buscar agendamentos do cliente:', error.message);
    throw new Error('Não foi possível buscar seus agendamentos.');
  }

  return data;
};

export const getAgendamentosPorDia = async (data) => {
  // data deve ser um objeto Date de JavaScript

  // Calcula o início do dia (00:00:00)
  const inicioDoDia = new Date(data);
  inicioDoDia.setHours(0, 0, 0, 0);

  // Calcula o fim do dia (23:59:59)
  const fimDoDia = new Date(data);
  fimDoDia.setHours(23, 59, 59, 999);

  const { data: agendamentos, error } = await supabase
    .from('agendamentos')
    .select(`
      id,
      data_hora_inicio,
      status,
      servicos ( nome, duracao_minutos ),
      profiles ( nome, email )
    `)
    // Onde 'data_hora_inicio' for maior ou igual (gte) ao início do dia
    .gte('data_hora_inicio', inicioDoDia.toISOString())
    // E onde 'data_hora_inicio' for menor ou igual (lte) ao fim do dia
    .lte('data_hora_inicio', fimDoDia.toISOString())
    .order('data_hora_inicio', { ascending: true }); // Ordena por hora, do mais cedo para o mais tarde

  if (error) {
    console.error('Erro ao buscar agendamentos do dia:', error.message);
    throw new Error('Não foi possível buscar a agenda do dia.');
  }

  return agendamentos;
};

export const agendamentosServices = {
  createAgendamento,
  getAgendamentosPorCliente,
  getAgendamentosPorDia,
  getHorariosDisponiveis
}

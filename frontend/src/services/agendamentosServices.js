import { supabase } from '../supabase';

export const createAgendamento = async (agendamentoData) => {
  const { cliente_id, servico_id, data_hora_inicio } = agendamentoData;

  // --- Passo 1: Obter a duração do serviço ---
  const { data: servico, error: servicoError } = await supabase
    .from('servicos')
    .select('duracao_minutos')
    .eq('id', servico_id)
    .single();

  if (servicoError || !servico) {
    console.error('Erro ao buscar serviço:', servicoError);
    throw new Error('Serviço não encontrado.');
  }

  // --- Passo 2: Calcular o horário de término ---
  const dataInicio = new Date(data_hora_inicio);
  const dataTermino = new Date(dataInicio.getTime() + servico.duracao_minutos * 60000); // 60000 ms = 1 minuto

  // --- Passo 3: Verificar se já existe um agendamento conflitante ---
  const { data: agendamentoConflitante, error: conflitoError } = await supabase
    .from('agendamentos')
    .select('id')
    // Um conflito existe se um agendamento começa ANTES do nosso terminar
    // E termina DEPOIS do nosso começar.
    .lt('data_hora_inicio', dataTermino.toISOString()) // lt = less than
    .gt('data_hora_fim', dataInicio.toISOString()) // gt = greater than (precisaremos adicionar a coluna data_hora_fim)
    .maybeSingle(); // Retorna um ou null, sem dar erro se não encontrar nada

  if (conflitoError) {
    console.error('Erro ao verificar conflitos:', conflitoError.message);
    throw new Error('Não foi possível verificar a disponibilidade.');
  }

  if (agendamentoConflitante) {
    // Se encontrou algum agendamento, significa que o horário está ocupado!
    throw new Error('Este horário já está ocupado. Por favor, escolha outro.');
  }

  // --- Passo 4: Se não houver conflitos, criar o agendamento ---
  const dadosParaInserir = {
    cliente_id,
    servico_id,
    data_hora_inicio: dataInicio.toISOString(),
    // É uma boa prática armazenar também a hora de término para facilitar futuras consultas.
    data_hora_fim: dataTermino.toISOString(), 
    status: 'confirmado'
  };

  const { data: novoAgendamento, error: insertError } = await supabase
    .from('agendamentos')
    .insert([dadosParaInserir])
    .select()
    .single();

  if (insertError) {
    console.error('Erro ao criar agendamento:', insertError.message);
    throw new Error('Não foi possível criar o agendamento.');
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
      usuarios ( nome, email )
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

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

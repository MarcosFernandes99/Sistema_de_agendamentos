import { supabase } from '../supabase';

export const createServico = async (servicoData) => {
  const { data, error } = await supabase
    .from('servicos')
    .insert([servicoData])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar serviço:', error.message);
    throw new Error('Não foi possível criar o serviço.');
  }

  return data;
};

export const getServicos = async () => {
    const { data, error } = await supabase
    .from('servicos')
    .select('*')
    // MELHORIA: Só busca serviços que estão marcados como ativos.
    .eq('ativo', true) 
    // MELHORIA: Retorna a lista ordenada por nome para uma UI mais consistente.
    .order('nome', { ascending: true });

  if (error) {
    console.error('Erro ao buscar serviços:', error.message);
    throw new Error('Não foi possível buscar os serviços.');
  }

  return data;
};

export const updateServico = async (servicoId, novosDados) => {
  const { data, error } = await supabase
    .from('servicos')
    .update(novosDados)
    .eq('id', servicoId)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar serviço:', error.message);
    throw new Error('Não foi possível atualizar o serviço.');
  }

  return data;
};

export const deactivateServico = async (servicoId) => {
   const { error } = await supabase
    .from('servicos')
    .update({ ativo: false }) // A MUDANÇA-CHAVE: Apenas marca como inativo.
    .eq('id', servicoId);

  if (error) {
    console.error('Erro ao desativar serviço:', error.message);
    throw new Error('Não foi possível desativar o serviço.');
  }

  return true;
};

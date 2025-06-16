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
    .select('*');

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

export const deleteServico = async (servicoId) => {
  const { error } = await supabase
    .from('servicos')
    .delete()
    .eq('id', servicoId);

  if (error) {
    console.error('Erro ao deletar serviço:', error.message);
    throw new Error('Não foi possível deletar o serviço.');
  }

  return true;
};

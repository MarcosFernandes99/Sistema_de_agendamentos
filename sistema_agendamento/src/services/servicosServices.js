import { supabase } from '../supabase'; // Importamos nossa conexão com o Supabase

// --- CREATE (Criar) ---
// Função para criar um novo serviço no banco de dados.
// Ela recebe um objeto 'servicoData' com os dados do novo serviço.
export const createServico = async (servicoData) => {
  const { data, error } = await supabase
    .from('servicos') // Seleciona a tabela 'servicos'
    .insert([servicoData]) // Insere um novo registro com os dados fornecidos
    .select() // Retorna o registro que acabou de ser criado
    .single(); // Garante que estamos retornando um único objeto, não um array

  if (error) {
    console.error('Erro ao criar serviço:', error.message);
    throw new Error('Não foi possível criar o serviço.');
  }

  return data;
};

// --- READ (Ler) ---
// Função para buscar TODOS os serviços do banco de dados.
export const getServicos = async () => {
  const { data, error } = await supabase
    .from('servicos')
    .select('*'); // O '*' significa "selecione todas as colunas"

  if (error) {
    console.error('Erro ao buscar serviços:', error.message);
    throw new Error('Não foi possível buscar os serviços.');
  }

  return data;
};

// --- UPDATE (Atualizar) ---
// Função para atualizar um serviço existente.
// Ela precisa do ID do serviço e dos novos dados a serem atualizados.
export const updateServico = async (servicoId, novosDados) => {
  const { data, error } = await supabase
    .from('servicos')
    .update(novosDados) // Atualiza com os novos dados
    .eq('id', servicoId) // Onde ('eq' = equals) o 'id' for igual ao 'servicoId'
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar serviço:', error.message);
    throw new Error('Não foi possível atualizar o serviço.');
  }

  return data;
};

// --- DELETE (Deletar) ---
// Função para deletar um serviço.
// Ela precisa apenas do ID do serviço que será deletado.
export const deleteServico = async (servicoId) => {
  const { error } = await supabase
    .from('servicos')
    .delete()
    .eq('id', servicoId); // Onde o 'id' for igual ao 'servicoId'

  if (error) {
    console.error('Erro ao deletar serviço:', error.message);
    throw new Error('Não foi possível deletar o serviço.');
  }

  // A operação de delete não retorna dados, então não há 'data' para retornar.
  return true;
};

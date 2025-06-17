import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Para pegar o ID do cliente
import { getServicos } from '../services/servicosServices'; // Para listar os serviços
import { createAgendamento } from '../services/agendamentosServices'; // Nossa função principal!

function AgendamentoPage() {
  const { user } = useAuth(); // Pega o usuário logado do nosso AuthContext

  // --- Estados para controlar o formulário ---
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  // ... outros estados que você precisar (ex: para horário)

  // --- Estados para feedback ao usuário ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Carrega a lista de serviços quando a página abre
  useEffect(() => {
    getServicos()
      .then(data => setServicos(data))
      .catch(err => setError('Não foi possível carregar os serviços.'));
  }, []);

  // ESTA É A FUNÇÃO ONDE VOCÊ PRECISA INSERIR O CÓDIGO
  const handleConfirmarAgendamento = async () => {
    // 1. Validação inicial (verificar se o usuário selecionou tudo)
    if (!servicoSelecionado || !dataSelecionada) {
      setError('Por favor, selecione um serviço e uma data.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    // 2. O Bloco try...catch entra em ação!
    try {
      // Tenta criar o agendamento chamando nossa função de serviço
      const novoAgendamento = await createAgendamento({
        cliente_id: user.id,
        servico_id: servicoSelecionado,
        data_hora_inicio: dataSelecionada, // Adapte para seu seletor de horário
      });
      
      // Se chegou aqui, deu tudo certo!
      setSuccess(`Agendamento confirmado com sucesso para o dia ${new Date(novoAgendamento.data_hora_inicio).toLocaleDateString()}!`);
      // Opcional: Limpar os campos após o sucesso
      setServicoSelecionado('');
      setDataSelecionada('');

    } catch (err) {
      // Se a função createAgendamento "jogou" um erro, nós o pegamos aqui
      // e mostramos a mensagem de erro para o usuário.
      setError(err.message);

    } finally {
      // Garante que o estado de "carregando" seja sempre desativado
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Faça seu Agendamento</h1>
      
      {/* Seletor de Serviço */}
      <select value={servicoSelecionado} onChange={(e) => setServicoSelecionado(e.target.value)}>
        <option value="">Selecione um serviço</option>
        {servicos.map(servico => (
          <option key={servico.id} value={servico.id}>
            {servico.nome}
          </option>
        ))}
      </select>

      {/* Seletor de Data */}
      <input type="datetime-local" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} />

      {/* Botão para confirmar */}
      <button onClick={handleConfirmarAgendamento} disabled={loading}>
        {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
      </button>

      {/* Área para mostrar as mensagens de feedback */}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default AgendamentoPage;

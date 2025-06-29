// frontend/src/pages/GerenciarServicos.jsx

import React, { useState, useEffect } from 'react';
// Corrija a importação se o nome do seu arquivo for diferente
import { getServicos, createServico } from '../services/servicosServices'; 

function GerenciarServicos() {
  const [servicos, setServicos] = useState([]);
  const [nomeServico, setNomeServico] = useState('');
  // NOVO: Estados para o preço e a duração
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('');

  // ... (seu useEffect para carregar os serviços continua igual) ...
  useEffect(() => {
    const carregarServicos = async () => {
      try {
        const dados = await getServicos();
        setServicos(dados);
      } catch (error) {
        console.error(error.message);
      }
    };
    carregarServicos();
  }, []);

  const handleNovoServico = async (e) => {
    e.preventDefault();
    if (!nomeServico || !preco || !duracao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // ALTERADO: Agora usamos os valores dos estados
      const novoServico = await createServico({
        nome: nomeServico,
        preco: parseFloat(preco), // Converte o texto para número
        duracao_minutos: parseInt(duracao, 10), // Converte para número inteiro
      });

      setServicos([...servicos, novoServico]);
      
      // NOVO: Limpa todos os campos após o sucesso
      setNomeServico('');
      setPreco('');
      setDuracao('');

    } catch (error) {
      console.error(error.message);
      alert("Erro ao criar serviço: " + error.message);
    }
  };

  return (
    <div>
      <h1>Gerenciar Serviços</h1>
      
      {/* ALTERADO: O formulário agora tem mais campos */}
      <form onSubmit={handleNovoServico}>
        <input 
          type="text" 
          value={nomeServico} 
          onChange={(e) => setNomeServico(e.target.value)} 
          placeholder="Nome do novo serviço"
          required
        />
        {/* NOVO: Input para o preço */}
        <input 
          type="number"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          placeholder="Preço (ex: 45.50)"
          step="0.01" // Permite casas decimais
          required
        />
        {/* NOVO: Input para a duração */}
        <input 
          type="number"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          placeholder="Duração (em minutos)"
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      {/* A lista de serviços existentes continua igual */}
      <ul>
        {servicos.map(servico => (
          <li key={servico.id}>
            {servico.nome} - R$ {servico.preco} ({servico.duracao_minutos} min)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GerenciarServicos;
// import React, { useState, useEffect } from 'react';
// import { getServicos, createServico } from '../services/servicosService';

// function GerenciarServicos() {
//   const [servicos, setServicos] = useState([]);
//   const [nomeServico, setNomeServico] = useState('');
//   // ... outros estados para preço, duração, etc.

//   // Executa quando o componente carrega pela primeira vez
//   useEffect(() => {
//     const carregarServicos = async () => {
//       try {
//         const dados = await getServicos();
//         setServicos(dados);
//       } catch (error) {
//         console.error(error.message);
//       }
//     };
//     carregarServicos();
//   }, []);

//   const handleNovoServico = async (e) => {
//     e.preventDefault();
//     try {
//       const novoServico = await createServico({
//         nome: nomeServico,
//         preco: 50.00, // Exemplo
//         duracao_minutos: 30, // Exemplo
//       });
//       // Adiciona o novo serviço à lista na tela, sem precisar recarregar a página
//       setServicos([...servicos, novoServico]);
//       // Limpa o campo de input
//       setNomeServico('');
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Gerenciar Serviços</h1>
      
//       {/* Formulário para criar novo serviço */}
//       <form onSubmit={handleNovoServico}>
//         <input 
//           type="text" 
//           value={nomeServico} 
//           onChange={(e) => setNomeServico(e.target.value)} 
//           placeholder="Nome do novo serviço"
//         />
//         <button type="submit">Adicionar</button>
//       </form>

//       {/* Lista de serviços existentes */}
//       <ul>
//         {servicos.map(servico => (
//           <li key={servico.id}>
//             {servico.nome} - R$ {servico.preco}
//             {/* Aqui você adicionaria botões para editar e deletar */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default GerenciarServicos;
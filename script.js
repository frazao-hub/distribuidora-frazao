import { salvarCliente, ouvirClientes } from './firebase.js';

// Ao carregar a página, começa a escutar os clientes do Firebase em tempo real
document.addEventListener('DOMContentLoaded', () => {
  
  // Atualiza a tabela/lista no PC e Celular sempre que houver mudanças
  ouvirClientes((clientes) => {
    renderizarClientes(clientes);
  });

  // Evento do Formulário de Cadastro
  const formCliente = document.getElementById('formCliente');
  if (formCliente) {
    formCliente.addEventListener('submit', (e) => {
      e.preventDefault();

      const novoCliente = {
        nome: document.getElementById('nomeCliente') ? document.getElementById('nomeCliente').value : '',
        telefone: document.getElementById('telefoneCliente') ? document.getElementById('telefoneCliente').value : '',
        endereco: document.getElementById('enderecoCliente') ? document.getElementById('enderecoCliente').value : '',
        dataCadastro: new Date().toISOString()
      };

      salvarCliente(novoCliente);
      formCliente.reset();
    });
  }
});

// Função para desenhar/renderizar a lista de clientes na página
function renderizarClientes(clientes) {
  const listaContainer = document.getElementById('listaClientes');
  if (!listaContainer) return;

  listaContainer.innerHTML = '';

  if (clientes.length === 0) {
    listaContainer.innerHTML = '<p>Nenhum cliente cadastrado.</p>';
    return;
  }

  clientes.forEach(cliente => {
    const item = document.createElement('div');
    item.className = 'cliente-item';
    item.style.padding = '10px';
    item.style.borderBottom = '1px solid #ccc';
    item.innerHTML = `
      <strong>${cliente.nome || 'Sem nome'}</strong><br>
      <span>Tel: ${cliente.telefone || 'N/A'}</span> | 
      <span>Endereço: ${cliente.endereco || 'N/A'}</span>
    `;
    listaContainer.appendChild(item);
  });
}

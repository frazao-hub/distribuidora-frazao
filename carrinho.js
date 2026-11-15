// carrinho.js - Distribuidora Frazão

let carrinho = JSON.parse(localStorage.getItem('carrinho_distribuidora')) || {};
let cliente = JSON.parse(localStorage.getItem('cliente_distribuidora')) || {};
const numeroWhatsApp = "5521968659086";

function escaparHTML(texto) {
    return String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function alterarQuantidade(id, nome, preco, delta) {
    if (!carrinho[id]) {
        if (delta > 0) carrinho[id] = { nome, preco, quantidade: delta };
    } else {
        carrinho[id].quantidade += delta;
        if (carrinho[id].quantidade <= 0) delete carrinho[id];
    }
    salvarESincronizar();
}

function limparCarrinho() {
    carrinho = {};
    salvarESincronizar();
}

function salvarESincronizar() {
    localStorage.setItem('carrinho_distribuidora', JSON.stringify(carrinho));
    if (typeof renderizarProdutos === "function") renderizarProdutos();
    atualizarCarrinhoUI();
}

function clienteCadastrado() {
    return cliente.nome && cliente.documento && cliente.telefone && cliente.endereco;
}

function mostrarResumoCliente() {
    let bloco = document.getElementById("dados-cliente");
    if (!bloco) {
        const caixa = document.querySelector(".carrinho-lateral");
        if (!caixa) return;
        bloco = document.createElement("div");
        bloco.id = "dados-cliente";
        bloco.style.cssText = "margin-top:15px;font-size:14px;";
        caixa.appendChild(bloco);
    }
    if (clienteCadastrado()) {
        bloco.innerHTML = `<strong>Cliente:</strong> ${escaparHTML(cliente.nome)}<br>
            <a href="clientes.html" style="color:#27ae60;">Editar meus dados</a>`;
    } else {
        bloco.innerHTML = `<a href="clientes.html" style="color:#e74c3c;font-weight:bold;">
            ⚠ Cadastre-se para enviar seu pedido</a>`;
    }
}

function atualizarCarrinhoUI() {
    const listaDiv = document.getElementById("lista-carrinho");
    if (!listaDiv) return;

    const totalDiv = document.getElementById("carrinho-total");
    const btnLimpar = document.getElementById("btn-limpar-carrinho");
    const footerTotal = document.getElementById("footer-total");

    mostrarResumoCliente();

    listaDiv.innerHTML = "";
    let valorTotal = 0;
    let temItens = false;
    let mensagem = "*NOVO PEDIDO*\n\n";
    let contador = 1;

    for (let id in carrinho) {
        temItens = true;
        const item = carrinho[id];
        const subtotal = item.preco * item.quantidade;
        valorTotal += subtotal;

        const itemDiv = document.createElement("div");
        itemDiv.className = "item-carrinho";
        itemDiv.innerHTML = `
            <div class="detalhes">
                <strong>${escaparHTML(item.nome)}</strong><br>
                <small>R$ ${item.preco.toFixed(2).replace('.', ',')} x ${item.quantidade}</small>
            </div>
            <div class="controles">
                <button onclick="alterarQuantidade('${id}', null, null, -1)">-</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade('${id}', null, null, 1)">+</button>
            </div>`;
        listaDiv.appendChild(itemDiv);

        mensagem += `${contador}. ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
        contador++;
    }

    if (!temItens) {
        listaDiv.innerHTML = '<p style="color:#888;font-size:14px;">Nenhum produto adicionado.</p>';
        if (totalDiv) totalDiv.style.display = "none";
        if (btnLimpar) btnLimpar.style.display = "none";
    } else {
        if (totalDiv) {
            totalDiv.style.display = "block";
            totalDiv.innerText = `Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
        }
        if (btnLimpar) btnLimpar.style.display = "block";
    }

    if (footerTotal) footerTotal.innerText = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

    mensagem += `\n*Valor Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}*`;

    mensagem += `\n\n*DADOS DO CLIENTE*\n`;
    mensagem += `Nome: ${cliente.nome || "(não informado)"}\n`;
    mensagem += `CPF/CNPJ: ${cliente.documento || "(não informado)"}\n`;
    mensagem += `Telefone: ${cliente.telefone || "(não informado)"}\n`;
    mensagem += `Endereço: ${cliente.endereco || "(não informado)"}`;

    const btnCotar = document.getElementById("btn-cotar");
    if (btnCotar) {
        btnCotar.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    }
}

window.addEventListener('storage', (e) => {
    if (e.key === 'carrinho_distribuidora') {
        carrinho = JSON.parse(e.newValue) || {};
        if (typeof renderizarProdutos === "function") renderizarProdutos();
    }
    if (e.key === 'cliente_distribuidora') {
        cliente = JSON.parse(e.newValue) || {};
    }
    atualizarCarrinhoUI();
});

document.addEventListener("DOMContentLoaded", () => {
    const btnCotar = document.getElementById("btn-cotar");
    if (btnCotar) {
        btnCotar.addEventListener("click", (e) => {
            if (Object.keys(carrinho).length === 0) {
                e.preventDefault();
                alert("Adicione pelo menos um produto ao carrinho.");
            } else if (!clienteCadastrado()) {
                e.preventDefault();
                alert("Faça seu cadastro antes de enviar o pedido.");
                window.location.href = "clientes.html";
            }
        });
    }
    atualizarCarrinhoUI();
});

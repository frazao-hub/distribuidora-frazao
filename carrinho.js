// carrinho.js - Lógica Global do Carrinho da Distribuidora Frazão

let carrinho = JSON.parse(localStorage.getItem('carrinho_distribuidora')) || {};
const numeroWhatsApp = "5521968659086";

function alterarQuantidade(id, nome, preco, delta) {
    if (!carrinho[id]) {
        if (delta > 0) {
            carrinho[id] = { nome, preco, quantidade: delta };
        }
    } else {
        carrinho[id].quantidade += delta;
        if (carrinho[id].quantidade <= 0) {
            delete carrinho[id];
        }
    }
    salvarESincronizar();
}

function limparCarrinho() {
    carrinho = {};
    salvarESincronizar();
}

function salvarESincronizar() {
    localStorage.setItem('carrinho_distribuidora', JSON.stringify(carrinho));
    atualizarCarrinhoUI();
}

function atualizarCarrinhoUI() {
    const listaDiv = document.getElementById("lista-carrinho");
    const totalDiv = document.getElementById("carrinho-total");
    const btnLimpar = document.getElementById("btn-limpar-carrinho");
    const footerTotal = document.getElementById("footer-total");
    
    if (!listaDiv) return; // Segurança caso a página não tenha o carrinho visível

    listaDiv.innerHTML = "";
    let valorTotal = 0;
    let temItens = false;

    let mensagem = "Olá! Gostaria de fazer a cotação dos seguintes produtos:\n\n";
    let contador = 1;

    for (let id in carrinho) {
        temItens = true;
        let item = carrinho[id];
        let subtotal = item.preco * item.quantidade;
        valorTotal += subtotal;

        const itemDiv = document.createElement("div");
        itemDiv.className = "item-carrinho";
        itemDiv.innerHTML = `
            <div class="detalhes">
                <strong>${item.nome}</strong><br>
                <small>R$ ${item.preco.toFixed(2).replace('.', ',')} x ${item.quantidade}</small>
            </div>
            <div class="controles">
                <button onclick="alterarQuantidade('${id}', '${item.nome}', ${item.preco}, -1)">-</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade('${id}', '${item.nome}', ${item.preco}, 1)">+</button>
            </div>
        `;
        listaDiv.appendChild(itemDiv);

        mensagem += `${contador}. ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
        contador++;
    }

    if (!temItens) {
        listaDiv.innerHTML = '<p style="color: #888; font-size: 14px;">Nenhum produto adicionado.</p>';
        if (totalDiv) totalDiv.style.display = "none";
        if (btnLimpar) btnLimpar.style.display = "none";
    } else {
        if (totalDiv) {
            totalDiv.style.display = "block";
            totalDiv.innerText = `Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
        }
        if (btnLimpar) btnLimpar.style.display = "block";
    }

    if (footerTotal) {
        footerTotal.innerText = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }
    mensagem += `\n*Valor Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}*`;

    const btnCotar = document.getElementById("btn-cotar");
    if (btnCotar) {
        const linkEncoded = encodeURI(mensagem);
        btnCotar.href = `https://wa.me/${numeroWhatsApp}?text=${linkEncoded}`;
    }
}

// Sincroniza automaticamente se o usuário abrir o site em abas diferentes
window.addEventListener('storage', (e) => {
    if (e.key === 'carrinho_distribuidora') {
        carrinho = JSON.parse(e.newValue) || {};
        atualizarCarrinhoUI();
    }
});

// Executa a leitura inicial do carrinho assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
    atualizarCarrinhoUI();
});

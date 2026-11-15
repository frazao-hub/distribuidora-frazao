// ==========================================
// PEDIDO-CORE.JS - Núcleo de Pedidos e Clientes
// Distribuidora Frazão
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyD8SnMWXagUVz4uVM87bc2dAakZyGGW3nM",
    authDomain: "distribuidora-frazao.firebaseapp.com",
    projectId: "distribuidora-frazao",
    storageBucket: "distribuidora-frazao.firebasestorage.app",
    messagingSenderId: "642540059204",
    appId: "1:642540059204:web:c113fa6966fd97fc20da11"
};

// Inicializa o Firebase apenas se já não estiver inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const WHATSAPP_FRAZAO = "5521968659086";

// Injeta automaticamente o Modal de Cadastro nas páginas de categoria caso o cliente não esteja logado
document.addEventListener("DOMContentLoaded", function() {
    if (!document.getElementById("modalCadastro")) {
        const modalHTML = `
        <div id="modalCadastro" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 9999; padding: 20px;">
            <div style="background: #fff; padding: 25px; border-radius: 8px; max-width: 450px; width: 100%; box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-family: Arial, sans-serif;">
                <h2 style="color: #27ae60; margin-top: 0; font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 8px;">Identificação do Cliente</h2>
                <p style="font-size: 13px; color: #555; margin-bottom: 15px;">Informe seus dados para enviar o pedido com seu cadastro completo:</p>
                <form onsubmit="salvarCadastroModal(event)">
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-weight: bold; font-size: 13px; margin-bottom: 4px; color: #444;">Nome Completo / Razão Social:</label>
                        <input type="text" id="modalNome" required placeholder="Ex: Mercado Bom Preço Ltda" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-weight: bold; font-size: 13px; margin-bottom: 4px; color: #444;">CPF / CNPJ:</label>
                        <input type="text" id="modalCpf" required placeholder="Digite seu CPF ou CNPJ" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-weight: bold; font-size: 13px; margin-bottom: 4px; color: #444;">Telefone / WhatsApp:</label>
                        <input type="tel" id="modalTelefone" required placeholder="(21) 99999-9999" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; font-size: 13px; margin-bottom: 4px; color: #444;">Endereço Completo (Rua, Nº, Bairro, Cidade):</label>
                        <input type="text" id="modalEndereco" required placeholder="Rua, Número, Bairro, Cidade" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    <button type="submit" id="btnSalvarModal" style="width: 100%; background: #27ae60; color: white; border: none; padding: 10px; border-radius: 4px; font-weight: bold; cursor: pointer;">Salvar e Enviar Pedido</button>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
});

// Função para salvar o cadastro no Firebase (coleção clientes) e no navegador
async function salvarCadastroModal(event) {
    event.preventDefault();
    const btn = document.getElementById("btnSalvarModal");
    btn.disabled = true;
    btn.textContent = "Salvando...";

    const cliente = {
        nome: document.getElementById("modalNome").value.trim(),
        cpf: document.getElementById("modalCpf").value.trim(),
        telefone: document.getElementById("modalTelefone").value.trim(),
        endereco: document.getElementById("modalEndereco").value.trim(),
        atualizadoEm: new Date()
    };

    const cpfCnpjLimpo = cliente.cpf.replace(/\D/g, '');

    try {
        // Salva na coleção clientes do Firebase Firestore
        await db.collection("clientes").doc(cpfCnpjLimpo).set(cliente, { merge: true });
        
        // Salva no navegador do cliente
        localStorage.setItem('dadosClienteFrazao', JSON.stringify(cliente));
        document.getElementById("modalCadastro").style.display = "none";
        
        // Se houver uma função de envio pendente, executa agora
        if (typeof window.executarEnvioPedido === "function") {
            window.executarEnvioPedido();
        }
    } catch (error) {
        console.error("Erro ao salvar cadastro:", error);
        alert("Erro ao salvar na nuvem: " + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = "Salvar e Enviar Pedido";
    }
}

// Função principal disparada pelo botão "Enviar Cotação WhatsApp" nas páginas de produtos
async function enviarPedidoWhatsApp(event) {
    if (event) event.preventDefault();

    // Valida se o carrinho existe e tem itens
    if (typeof carrinho === 'undefined' || Object.keys(carrinho).length === 0) {
        alert("Seu carrinho está vazio. Adicione produtos antes de enviar a cotação.");
        return;
    }

    // Verifica se os dados do cliente já estão salvos no navegador
    const dadosSalvos = localStorage.getItem('dadosClienteFrazao');
    if (!dadosSalvos) {
        document.getElementById("modalCadastro").style.display = "flex";
        return;
    }

    window.executarEnvioPedido = async function() {
        const cliente = JSON.parse(localStorage.getItem('dadosClienteFrazao'));
        
        let mensagem = "*NOVO PEDIDO - DISTRIBUIDORA FRAZÃO*\n\n";
        mensagem += "*DADOS DO CLIENTE:*\n";
        mensagem += `• Nome/Razão: ${cliente.nome}\n`;
        mensagem += `• CPF/CNPJ: ${cliente.cpf}\n`;
        mensagem += `• Telefone: ${cliente.telefone}\n`;
        mensagem += `• Endereço: ${cliente.endereco}\n`;
        mensagem += "--------------------------------\n";
        mensagem += "*ITENS DO PEDIDO:*\n";

        let itensArray = [];
        let valorTotal = 0;
        let contador = 1;

        for (let id in carrinho) {
            let item = carrinho[id];
            let subtotal = item.preco * item.quantidade;
            valorTotal += subtotal;

            itensArray.push({
                id: id,
                nome: item.nome,
                preco: item.preco,
                quantidade: item.quantidade,
                subtotal: subtotal
            });

            mensagem += `${contador}. ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
            contador++;
        }

        mensagem += `\n*Valor Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}*`;

        try {
            // Grava o pedido completo na coleção "pedidos" do Firebase Firestore
            await db.collection("pedidos").add({
                dataPedido: new Date(),
                cliente: cliente,
                itens: itensArray,
                total: valorTotal
            });
        } catch (erro) {
            console.warn("Aviso ao gravar pedido no Firebase:", erro);
        }

        // Abre o WhatsApp com a mensagem formatada contendo o cadastro + itens
        const linkEncoded = encodeURIComponent(mensagem);
        window.open(`https://wa.me/${WHATSAPP_FRAZAO}?text=${linkEncoded}`, '_blank');
    };

    window.executarEnvioPedido();
}

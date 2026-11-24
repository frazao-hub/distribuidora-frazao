// busca.js - Busca Global Distribuidora Frazão

let catalogoGlobal = [];

const MAPA_CATEGORIAS = {
    "bal": { nome: "Balas e Pirulitos", pagina: "balas-e-pirulitos.html" },
    "pir": { nome: "Balas e Pirulitos", pagina: "balas-e-pirulitos.html" },
    "beb": { nome: "Bebidas", pagina: "bebidas.html" },
    "bis": { nome: "Biscoitos", pagina: "biscoitos.html" },
    "des": { nome: "Descartáveis", pagina: "descartaveis.html" },
    "doc": { nome: "Doces", pagina: "doces.html" },
    "dro": { nome: "Drops e Chicletes", pagina: "drops-e-chicletes.html" },
    "chi": { nome: "Drops e Chicletes", pagina: "drops-e-chicletes.html" },
    "hig": { nome: "Higiene", pagina: "higiene.html" },
    "lim": { nome: "Limpeza", pagina: "limpeza.html" },
    "mer": { nome: "Mercearia", pagina: "mercearia.html" },
    "pap": { nome: "Papelaria", pagina: "papelaria.html" }
};

function obterPrefixoID(id) {
    return String(id || "").split(/[_-]/)[0].toLowerCase();
}

function obterInfoCategoria(id) {
    const prefixo = obterPrefixoID(id);
    return MAPA_CATEGORIAS[prefixo] || { nome: "Catálogo", pagina: "index.html" };
}

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

async function carregarCatalogoGlobal() {
    if (catalogoGlobal.length > 0) return catalogoGlobal;
    try {
        const resposta = await fetch("produtos.json");
        if (!resposta.ok) throw new Error("Erro ao carregar produtos.json");
        catalogoGlobal = await resposta.json();
    } catch (erro) {
        console.error("Falha na busca global:", erro);
    }
    return catalogoGlobal;
}

function renderizarResultadosBusca(termoDigitado) {
    const boxResultados = document.getElementById("resultadosBuscaGlobal");
    if (!boxResultados) return;

    const termo = normalizarTexto(termoDigitado.trim());
    boxResultados.innerHTML = "";

    if (termo.length < 2) {
        boxResultados.style.display = "none";
        return;
    }

    const encontrados = catalogoGlobal.filter((prod) => {
        const infoCat = obterInfoCategoria(prod.id);
        return (
            normalizarTexto(prod.nome).includes(termo) ||
            normalizarTexto(prod.id).includes(termo) ||
            normalizarTexto(infoCat.nome).includes(termo)
        );
    });

    if (encontrados.length === 0) {
        boxResultados.innerHTML = `<div class="busca-vazia">Nenhum produto encontrado para "${escaparHTML(termoDigitado)}".</div>`;
        boxResultados.style.display = "block";
        return;
    }

    encontrados.slice(0, 25).forEach((prod) => {
        const precoNum = Number(prod.preco) || 0;
        const precoFmt = precoNum.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        const infoCat = obterInfoCategoria(prod.id);
        const qtdNoCarrinho = (typeof carrinho !== "undefined" && carrinho[prod.id]) ? carrinho[prod.id].quantidade : 0;

        const itemDiv = document.createElement("div");
        itemDiv.className = "item-resultado-busca";

        const imgHTML = prod.imagem && prod.imagem.trim() !== ""
            ? `<img src="${escaparHTML(prod.imagem)}" alt="${escaparHTML(prod.nome)}">`
            : `<div class="sem-foto-busca">📦</div>`;

        itemDiv.innerHTML = `
            <a href="${infoCat.pagina}#${escaparHTML(prod.id)}" class="link-produto-busca">
                ${imgHTML}
                <div class="info-produto-busca">
                    <div class="nome-produto-busca">${escaparHTML(prod.nome)}</div>
                    <div class="meta-produto-busca">
                        <span>${escaparHTML(infoCat.nome)}</span> • 
                        <strong class="preco-produto-busca">${precoFmt}</strong>
                    </div>
                </div>
            </a>
            <div class="acoes-produto-busca">
                ${qtdNoCarrinho > 0
                    ? `<button type="button" class="btn-qtd-busca" data-delta="-1">-</button>
                       <span class="qtd-atual-busca">${qtdNoCarrinho}</span>
                       <button type="button" class="btn-qtd-busca" data-delta="1">+</button>`
                    : `<button type="button" class="btn-add-busca" data-delta="1">+ Adicionar</button>`
                }
            </div>
        `;

        itemDiv.querySelectorAll("button[data-delta]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const delta = Number(btn.getAttribute("data-delta"));
                if (typeof alterarQuantidade === "function") {
                    alterarQuantidade(prod.id, prod.nome, precoNum, delta);
                    const input = document.getElementById("inputBuscaGlobal");
                    if (input) renderizarResultadosBusca(input.value);
                }
            });
        });

        boxResultados.appendChild(itemDiv);
    });

    boxResultados.style.display = "block";
}

document.addEventListener("DOMContentLoaded", async () => {
    await carregarCatalogoGlobal();

    const inputBusca = document.getElementById("inputBuscaGlobal");
    const btnLimparBusca = document.getElementById("btnLimparBusca");
    const boxResultados = document.getElementById("resultadosBuscaGlobal");

    if (!inputBusca || !boxResultados) return;

    inputBusca.addEventListener("input", function () {
        if (btnLimparBusca) {
            btnLimparBusca.style.display = this.value.length > 0 ? "inline-block" : "none";
        }
        renderizarResultadosBusca(this.value);
    });

    inputBusca.addEventListener("focus", function () {
        if (this.value.trim().length >= 2) {
            renderizarResultadosBusca(this.value);
        }
    });

    if (btnLimparBusca) {
        btnLimparBusca.addEventListener("click", () => {
            inputBusca.value = "";
            btnLimparBusca.style.display = "none";
            boxResultados.style.display = "none";
            inputBusca.focus();
        });
    }

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".busca-global-container")) {
            boxResultados.style.display = "none";
        }
    });
});

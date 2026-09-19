<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Vendedor</title>
    
    <!-- Scripts do Firebase v9 (SDK Web Compat) -->
    <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>

    <style>
        * { box-sizing: border-box; font-family: Arial, sans-serif; margin: 0; padding: 0; }
        body { background-color: #f4f6f9; padding: 20px; display: flex; justify-content: center; }
        .container { width: 100%; max-width: 500px; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
        h2 { margin-bottom: 20px; color: #333333; font-size: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; color: #555555; font-size: 14px; }
        input { width: 100%; padding: 10px; border: 1px solid #cccccc; border-radius: 4px; font-size: 14px; }
        input:focus { border-color: #007bff; outline: none; }
        button { width: 100%; padding: 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: bold; }
        button:hover { background-color: #218838; }
        .lista-vendedores { margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #dddddd; text-align: left; padding: 10px; font-size: 14px; }
        th { background-color: #f8f9fa; }
        .btn-excluir { background-color: #dc3545; padding: 5px 10px; font-size: 12px; width: auto; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn-excluir:hover { background-color: #bd2130; }
    </style>
</head>
<body>

<div class="container">
    <h2>Cadastrar Vendedor</h2>
    
    <form id="formVendedor">
        <div class="form-group">
            <label for="nome">Nome do Vendedor:</label>
            <input type="text" id="nome" placeholder="Digite o nome completo" required>
        </div>

        <div class="form-group">
            <label for="senha">Senha de Acesso:</label>
            <input type="password" id="senha" placeholder="Digite a senha do vendedor" required>
        </div>

        <button type="submit" id="btnSalvar">Cadastrar Vendedor</button>
    </form>

    <div class="lista-vendedores">
        <h2>Vendedores Salvos na Nuvem</h2>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Senha</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody id="tabelaVendedores">
                <tr><td colspan="3" style="text-align:center;">Carregando dados...</td></tr>
            </tbody>
        </table>
    </div>
</div>

<script>
    // Configurações do Firebase da Distribuidora Frazão
    const firebaseConfig = {
        apiKey: "AIzaSyD8SnMWXagUVz4uVM87bc2dAakZyGGW3nM",
        authDomain: "distribuidora-frazao.firebaseapp.com",
        projectId: "distribuidora-frazao",
        storageBucket: "distribuidora-frazao.firebasestorage.app",
        messagingSenderId: "642540059204",
        appId: "1:642540059204:web:c113fa6966fd97fc20da11"
    };

    // Inicializar o Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const form = document.getElementById('formVendedor');
    const tabela = document.getElementById('tabelaVendedores');

    // Função otimizada para carregar os vendedores uma única vez (sem escuta em tempo real travando o navegador)
    function carregarVendedores() {
        tabela.innerHTML = '<tr><td colspan="3" style="text-align:center;">Carregando dados...</td></tr>';

        db.collection("vendedores").get()
            .then((snapshot) => {
                tabela.innerHTML = '';
                
                if (snapshot.empty) {
                    tabela.innerHTML = '<tr><td colspan="3" style="text-align:center;">Nenhum vendedor cadastrado na nuvem.</td></tr>';
                    return;
                }

                snapshot.forEach((doc) => {
                    const vendedor = doc.data();
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${vendedor.nome}</td>
                        <td>${vendedor.senha}</td>
                        <td><button class="btn-excluir" onclick="removerVendedor('${doc.id}')">Excluir</button></td>
                    `;
                    tabela.appendChild(tr);
                });
            })
            .catch((error) => {
                console.error("Erro ao carregar dados:", error);
                tabela.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red;">Erro ao carregar os dados. Verifique as regras no Firebase.</td></tr>';
            });
    }

    // Salvar novo vendedor no Firebase
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const senha = document.getElementById('senha').value.trim();

        const btnSalvar = document.getElementById('btnSalvar');
        btnSalvar.disabled = true;
        btnSalvar.innerText = 'Gravando...';

        db.collection("vendedores").add({
            nome: nome,
            senha: senha,
            criadoEm: new Date()
        })
        .then(() => {
            alert('Vendedor salvo na nuvem com sucesso!');
            form.reset();
            carregarVendedores(); // Atualiza a tabela instantaneamente após salvar
        })
        .catch((error) => {
            alert('Erro ao gravar no banco: ' + error.message);
        })
        .finally(() => {
            btnSalvar.disabled = false;
            btnSalvar.innerText = 'Cadastrar Vendedor';
        });
    });

    // Excluir vendedor do Firebase
    function removerVendedor(id) {
        if (confirm('Deseja excluir este vendedor da nuvem?')) {
            db.collection("vendedores").doc(id).delete()
            .then(() => {
                alert('Vendedor removido!');
                carregarVendedores(); // Atualiza a tabela após a exclusão
            })
            .catch((error) => alert('Erro ao remover: ' + error.message));
        }
    }

    // Carrega os dados assim que a página é aberta
    carregarVendedores();
</script>

</body>
</html>

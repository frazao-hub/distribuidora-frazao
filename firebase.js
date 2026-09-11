<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Vendedores</title>
    <style>
        * {
            box-sizing: border-box;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: #f4f6f9;
            padding: 20px;
            display: flex;
            justify-content: center;
        }

        .container {
            width: 100%;
            max-width: 600px;
            background: #ffffff;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            margin-bottom: 20px;
            color: #333333;
            font-size: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555555;
            font-size: 14px;
        }

        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #cccccc;
            border-radius: 4px;
            font-size: 14px;
        }

        input:focus {
            border-color: #007bff;
            outline: none;
        }

        button {
            width: 100%;
            padding: 12px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
        }

        button:hover {
            background-color: #0056b3;
        }

        .lista-vendedores {
            margin-top: 30px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 10px;
            font-size: 14px;
        }

        th {
            background-color: #f8f9fa;
        }

        .btn-excluir {
            background-color: #dc3545;
            padding: 5px 10px;
            font-size: 12px;
            width: auto;
        }

        .btn-excluir:hover {
            background-color: #bd2130;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Cadastrar Novo Vendedor</h2>
    
    <form id="formVendedor">
        <div class="form-group">
            <label for="nome">Nome Completo:</label>
            <input type="text" id="nome" placeholder="Ex: João Silva" required>
        </div>

        <div class="form-group">
            <label for="usuario">Usuário / Login:</label>
            <input type="text" id="usuario" placeholder="Ex: joaosilva" required>
        </div>

        <div class="form-group">
            <label for="senha">Senha de Acesso:</label>
            <input type="password" id="senha" placeholder="Digite uma senha inicial" required>
        </div>

        <button type="submit">Salvar Vendedor</button>
    </form>

    <div class="lista-vendedores">
        <h2>Vendedores Cadastrados</h2>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Usuário / Login</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="tabelaVendedores">
                <!-- Vendedores cadastrados vão aparecer aqui -->
            </tbody>
        </table>
    </div>
</div>

<script>
    // Carregar vendedores salvos ao abrir a página
    document.addEventListener('DOMContentLoaded', carregarVendedores);

    const form = document.getElementById('formVendedor');
    const tabela = document.getElementById('tabelaVendedores');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const usuario = document.getElementById('usuario').value.trim();
        const senha = document.getElementById('senha').value;

        // Criar objeto do vendedor
        const novoVendedor = {
            id: Date.now(),
            nome: nome,
            usuario: usuario,
            senha: senha
        };

        // Salvar os dados
        salvarVendedor(novoVendedor);
    });

    function salvarVendedor(vendedor) {
        let vendedores = JSON.parse(localStorage.getItem('vendedores_db')) || [];
        
        // Verifica se o login de usuário já existe
        const existe = vendedores.some(v => v.usuario.toLowerCase() === vendedor.usuario.toLowerCase());
        if (existe) {
            alert('Este usuário de login já está cadastrado para outro vendedor!');
            return;
        }

        vendedores.push(vendedor);
        localStorage.setItem('vendedores_db', JSON.stringify(vendedores));
        
        alert('Vendedor cadastrado com sucesso!');
        form.reset();
        carregarVendedores();
    }

    function carregarVendedores() {
        tabela.innerHTML = '';
        let vendedores = JSON.parse(localStorage.getItem('vendedores_db')) || [];

        if (vendedores.length === 0) {
            tabela.innerHTML = '<tr><td colspan="3" style="text-align:center;">Nenhum vendedor cadastrado.</td></tr>';
            return;
        }

        vendedores.forEach(vendedor => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${vendedor.nome}</td>
                <td>${vendedor.usuario}</td>
                <td><button class="btn-excluir" onclick="removerVendedor(${vendedor.id})">Excluir</button></td>
            `;
            tabela.appendChild(tr);
        });
    }

    function removerVendedor(id) {
        if (confirm('Tem certeza que deseja remover este vendedor?')) {
            let vendedores = JSON.parse(localStorage.getItem('vendedores_db')) || [];
            vendedores = vendedores.filter(v => v.id !== id);
            localStorage.setItem('vendedores_db', JSON.stringify(vendedores));
            carregarVendedores();
        }
    }
</script>

</body>
</html>

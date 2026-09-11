<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Vendedor</title>
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
            max-width: 500px;
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
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
        }

        button:hover {
            background-color: #218838;
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
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-excluir:hover {
            background-color: #bd2130;
        }
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

        <button type="submit">Cadastrar Vendedor</button>
    </form>

    <div class="lista-vendedores">
        <h2>Vendedores Salvos</h2>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Senha</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody id="tabelaVendedores">
                <!-- Os dados aparecem aqui -->
            </tbody>
        </table>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', carregarVendedores);

    const form = document.getElementById('formVendedor');
    const tabela = document.getElementById('tabelaVendedores');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const senha = document.getElementById('senha').value.trim();

        const novoVendedor = {
            id: Date.now(),
            nome: nome,
            senha: senha
        };

        salvarVendedor(novoVendedor);
    });

    function salvarVendedor(vendedor) {
        let vendedores = JSON.parse(localStorage.getItem('vendedores_db')) || [];
        
        // Evita cadastrar o mesmo nome duas vezes
        const existe = vendedores.some(v => v.nome.toLowerCase() === vendedor.nome.toLowerCase());
        if (existe) {
            alert('Já existe um vendedor cadastrado com esse nome!');
            return;
        }

        vendedores.push(vendedor);
        localStorage.setItem('vendedores_db', JSON.stringify(vendedores));
        
        alert('Vendedor cadastrado e gravado com sucesso!');
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
                <td>${vendedor.senha}</td>
                <td><button class="btn-excluir" onclick="removerVendedor(${vendedor.id})">Excluir</button></td>
            `;
            tabela.appendChild(tr);
        });
    }

    function removerVendedor(id) {
        if (confirm('Deseja excluir este vendedor?')) {
            let vendedores = JSON.parse(localStorage.getItem('vendedores_db')) || [];
            vendedores = vendedores.filter(v => v.id !== id);
            localStorage.setItem('vendedores_db', JSON.stringify(vendedores));
            carregarVendedores();
        }
    }
</script>

</body>
</html>

<?php
use Illuminate\Support\Facades\Route;
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Usuário</title>
    
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    
    <!--  Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <!-- Logo -->
            <a class="navbar-brand text-light" href="{{ route('TelaInicio') }}">Marca I</a>
            
            <!-- Botão mobile -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        
            <!-- Links -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    @if(Auth::check())
                        <li class="nav-item ms-3">
                            <form action="{{ route('logout') }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-danger btn-sm">Sair</button>
                            </form>
                        </li>
                    @endif
                </ul>
            </div>
        </div>
    </nav>

    <!--  Conteúdo principal -->
    <div class="container mt-5">
        <div class="card shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="mb-0">Editar Usuário</h4>
            </div>
            
            <div class="card-body">
                <!-- Mensagens de sucesso/erro -->
                @if (session('success'))
                    <div class="alert alert-success">{{ session('success') }}</div>
                @endif
                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul class="mb-0">
                            @foreach ($errors->all() as $erro)
                                <li>{{ $erro }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                
                <!-- Formulário -->
                <form action="{{ route('user.update', $user->id) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <!-- Nome -->
                    <div class="mb-3">
                        <label for="name" class="form-label">Nome:</label>
                        <input type="text" class="form-control bg-light" id="name" name="name"
                            placeholder="Digite o nome" value="{{ old('name', $user->name) }}" required>
                    </div>

                    <!-- E-mail -->
                    <div class="mb-3">
                        <label for="email" class="form-label">E-mail:</label>
                        <input type="email" class="form-control bg-light" id="email" name="email"
                            placeholder="Digite o e-mail" value="{{ old('email', $user->email) }}" required>
                    </div>

                    <!-- Nova senha -->
                    <div class="mb-3">
                        <label for="password" class="form-label">Nova Senha (opcional):</label>
                        <input type="password" class="form-control" id="password" name="password"
                            placeholder="Digite uma nova senha (deixe em branco se não quiser mudar)">
                    </div>

                    <!-- Confirmação da senha -->
                    <div class="mb-3">
                        <label for="password_confirmation" class="form-label">Confirmar Nova Senha:</label>
                        <input type="password" class="form-control" id="password_confirmation" name="password_confirmation"
                            placeholder="Repita a nova senha">
                    </div>

                    <button type="submit" class="btn btn-success">Confirmar Mudanças</button>
                    <a href="{{ route('usuario') }}" class="btn btn-secondary">Cancelar</a>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

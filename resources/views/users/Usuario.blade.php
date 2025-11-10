<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>TelaUsuario</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">

</head>
<body>
    
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
                <!--<li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Usuário</a></li>-->
                <!--<li class="nav-item"><a class="nav-link" href="#">Sobre</a></li>-->
                <!--<li class="nav-item"><a class="nav-link" href="#">Contato</a></li>-->

                 <!-- Exibe botão Sair apenas se o usuário estiver logado -->
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
    <!-- Área central -->
<div class="container mt-4">
    <div class="d-flex justify-content-between">
        
        <!-- Botão de deletar -->
        <form action="{{ route('user.destroy', Auth::user()->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar sua conta?')">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger">Deletar Usuário</button>
        </form>

        <!-- Botão para encaminha para edicao -->
        <a href="{{ route('editarusuario', Auth::user()->id) }}" class="btn btn-primary">Editar Usuário</a>

    </div>
</div>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"crossorigin="anonymous"></script>
</body>
</html>

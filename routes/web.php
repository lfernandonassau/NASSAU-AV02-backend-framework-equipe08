<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LoginControler;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

//criacao do usuario
Route::get('/create.user', [UserController::class, 'create'])
->name('user.create');
Route::post('/store.user', [UserController::class, 'store'])
->name('user.store');

//Login
Route::get('/login', [LoginControler::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginControler::class, 'login'])->name('login.enter');
Route::post('/logout', [LoginControler::class, 'logout'])->middleware('auth')->name('logout');

//Redireciona para view Tela Inicio (->middleware('auth')) serve para proteger o usuario
Route::get('/inicio', function () {
    return view('TelaInicio');
})->middleware('auth')->name('TelaInicio');

// Redireciona para a view 
Route::get('/usuario', function () {
    return view('users.Usuario');
})->middleware('auth')->name('usuario');

// Redireciona para a de edicao
Route::get('/EditarUsuario/{id}', [UserController::class, 'edit'])
    ->middleware('auth')
    ->name('editarusuario');


// Editar usuário
Route::get('/user/{id}/edit', [UserController::class, 'edit'])
->middleware('auth')->name('user.edit');
Route::put('/user/{id}', [UserController::class, 'update'])
->middleware('auth')->name('user.update');

// Soft delete
Route::delete('/user/{id}', [UserController::class, 'destroy'])
->middleware('auth')->name('user.destroy');
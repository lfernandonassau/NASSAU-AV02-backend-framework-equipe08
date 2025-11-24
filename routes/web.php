<?php

use Illuminate\Support\Facades\Route;

// Todas as rotas do React SPA
Route::get('/{any}', fn() => view('welcome'))->where('any', '.*');




<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conta extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'descricao',
        'preco',
        'data_vencimento',
        'data_pagamento',
        'status',
        'user_id', 
    ];
    protected $dates = ['deleted_at']; // Marca deleted_at como data
}

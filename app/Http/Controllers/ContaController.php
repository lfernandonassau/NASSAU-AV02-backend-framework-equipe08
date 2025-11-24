<?php

namespace App\Http\Controllers;

use App\Models\Conta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContaController extends Controller
{
    // Retorna todas as contas do usuário logado (JSON)
    public function getContasJson()
    {
        $user = Auth::user();
        if (!$user) {
            abort(403, 'Usuário não logado.');
        }

        $contas = Conta::where('user_id', $user->id)
                        ->orderBy('id', 'desc')
                        ->get();

        $totalAbertas = Conta::where('user_id', $user->id)
                              ->where('status', 'Aberta')
                              ->sum('preco');

        return response()->json([
            'contas' => $contas,
            'totalAbertas' => $totalAbertas
        ]);
    }

    // Retorna uma conta específica em JSON
    public function showContaJson($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuário não logado'], 401);
        }

        $conta = Conta::where('id', $id)
                      ->where('user_id', $user->id)
                      ->first();

        if (!$conta) {
            return response()->json(['error' => 'Conta não encontrada'], 404);
        }

        return response()->json($conta);
    }

    // Atualização via JSON
    public function updateJson(Request $request, Conta $conta)
    {
        if ($conta->user_id !== Auth::id()) {
            return response()->json(['error' => 'Ação não autorizada'], 403);
        }

        $request->validate([
            'descricao' => 'required|string|max:255',
            'preco' => 'required|numeric',
            'data_vencimento' => 'required|date',
        ]);

        $conta->update($request->all());

        return response()->json([
            'message' => 'Conta atualizada com sucesso!',
            'conta' => $conta
        ]);
    }
    //soft delete das contas 
    public function destroy($id)
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['error' => 'Usuário não logado'], 401);
    }

    $conta = Conta::where('id', $id)
                  ->where('user_id', $user->id)
                  ->first();

    if (!$conta) {
        return response()->json(['error' => 'Conta não encontrada'], 404);
    }

    try {
        $conta->delete(); 
        return response()->json(['message' => 'Conta excluída com sucesso!']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Erro ao excluir conta'], 500);
    }
}
//função para restaurar as contas deletadas(mas não estou usando só deixei aqui caso queira usar mais para frente)
public function restore($id)
{
    $conta = Conta::withTrashed()->where('id', $id)->where('user_id', Auth::id())->first();

    if (!$conta) {
        return response()->json(['error' => 'Conta não encontrada'], 404);
    }

    $conta->restore();
    return response()->json(['message' => 'Conta restaurada com sucesso!']);
}

}

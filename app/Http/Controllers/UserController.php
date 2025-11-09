<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Carrega o formulário para cadastro de novo usuário
    public function create()
    {
        //caregar view
        return view('users.create');
    }
        public function store(Request $request)
    {
        try {
        //caregar view
        User::create($request->all());

        return redirect()->route('user.create')->with('success', 'Usuario Cadastrado');

        }catch (Exception $e){
              return back()->withInput()->with('error', 'Usuario não Cadastrado');
    }
} 
public function destroy($id){
// Garante que o usuário só pode deletar a própria conta
    if (Auth::id() != $id) {
    return redirect()->back()->with('error', 'Ação não permitida.');
    }
    $user = User::findOrFail($id);
    $user->delete(); // 👈 Soft delete (não apaga do banco)

    return redirect()->route('TelaInicio')->with('success', 'Usuário deletado com sucesso!');
}

}
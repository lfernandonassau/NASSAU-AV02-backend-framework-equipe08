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
    $user->delete(); //Soft delete (não apaga do banco)

    return redirect()->route('welcome')->with('success', 'Usuário deletado com sucesso!');
}

public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    // Validação
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id, // garante e-mail único
        'password' => 'nullable|string|min:6|confirmed', // senha opcional
    ]);

    //os dados que serão atualizados
    $data = [
        'name' => $request->name,
        'email' => $request->email,
    ];

    // Atualiza a senha somente se o campo foi preenchido
    if ($request->filled('password')) {
        $data['password'] = bcrypt($request->password);
    }

    $user->update($data);

    return redirect()->route('usuario')->with('success', 'Usuário atualizado com sucesso!');
}

public function edit($id)
{
    // Busca o usuário pelo ID
    $user = User::findOrFail($id);

    // Garante que o usuário só pode editar a própria conta
    if (Auth::id() != $user->id) {
        return redirect()->back()->with('error', 'Ação não permitida.');
    }

    return view('users.EditarUsuario', compact('user'));
}

}
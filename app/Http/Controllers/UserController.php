<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Carrega view de criação
     */
    public function create()
    {
        return view('users.create');
    }


    /**
     * Registrar usuário
     */
    public function store(Request $request)
    {
        try {
            // Validação com verificação de domínio real
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'email',
                    'unique:users,email',
                    function ($attribute, $value, $fail) {
                        $domain = substr(strrchr($value, "@"), 1);

                        // Verifica domínio real (registros MX)
                        if (!checkdnsrr($domain, 'MX')) {
                            $fail('O domínio do e-mail não existe ou não pode receber e-mails.');
                        }
                    }
                ],
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors()
                ], 422);
            }

            // Criar usuário
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);

            return response()->json([
                'message' => 'Usuário cadastrado com sucesso!'
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erro ao cadastrar usuário.',
                'details' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Atualizar usuário
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if (Auth::id() != $user->id) {
            return response()->json([
                'error' => 'Ação não permitida.'
            ], 403);
        }

        // Validação com domínio real
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'unique:users,email,' . $user->id,
                function ($attribute, $value, $fail) {
                    $domain = substr(strrchr($value, "@"), 1);

                    if (!checkdnsrr($domain, 'MX')) {
                        $fail('O domínio do e-mail não existe ou não pode receber e-mails.');
                    }
                }
            ],
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Usuário atualizado com sucesso!'
        ]);
    }


    /**
     * Buscar usuário para edição
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);

        if (Auth::id() != $user->id) {
            return response()->json([
                'error' => 'Ação não permitida.'
            ], 403);
        }

        return response()->json($user);
    }


    /**
     * Soft Delete
     */
    public function destroy($id)
    {
        if (Auth::id() != $id) {
            return response()->json([
                'error' => 'Ação não permitida.'
            ], 403);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'Usuário deletado com sucesso!'
        ]);
    }
}

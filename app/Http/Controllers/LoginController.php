<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class LoginController extends Controller
{
    /**
     * Login usando JWT
     */
    public function login(Request $request)
    {
        // Validação
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        $credentials = $request->only('email', 'password');

        try {
            // Tentar gerar o token
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'message' => 'invalid_credentials'
                ], 401);
            }
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'could_not_create_token',
                'error' => $e->getMessage()
            ], 500);
        }

        // Retorna o token para o React
        return response()->json([
            'message' => 'ok',
            'token'   => $token
        ]);
    }

    /**
     * Logout JWT (invalida o token)
     */
    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'message' => 'logged_out'
            ], 200);

        } catch (JWTException $e) {
            return response()->json([
                'message' => 'could_not_invalidate_token'
            ], 500);
        }
    }

    /**
     * Retorna o usuário autenticado (protegido)
     */
    public function me(Request $request)
    {
        return response()->json(JWTAuth::user());
    }
}

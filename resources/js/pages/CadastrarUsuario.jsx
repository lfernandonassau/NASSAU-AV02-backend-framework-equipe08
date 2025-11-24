import React, { useState } from "react";
import api from "../api/api"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function CadastrarUsuario() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Logout com JWT 
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    // Enviar cadastro
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            const res = await api.post("/register", {
                name,
                email,
                password,
            });

            setSuccess(res.data.message || "Usuário cadastrado com sucesso!");

            setName("");
            setEmail("");
            setPassword("");
        } catch (err) {
            if (err.response?.status === 422) {
                setError("Dados inválidos. Verifique os campos.");
            } else {
                setError("Erro ao cadastrar o usuário.");
            }
        }
    };

    return (
        <div className="bg-light min-vh-100">

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand text-light" href="/">Marca I</a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item ms-3">
                                <button
                                    className="btn btn-danger btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target="#confirmLogoutModal"
                                >
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Modal Logout */}
            <div className="modal fade" id="confirmLogoutModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-lg border-0">
                        <div className="modal-header bg-warning text-dark">
                            <h5 className="modal-title">Confirmar Saída</h5>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">Tem certeza que deseja sair?</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button className="btn btn-warning text-dark" onClick={handleLogout}>Sair</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="container mt-5">
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <h4 className="mb-0">Cadastrar Usuário</h4>
                    </div>

                    <div className="card-body">

                        {/* Mensagens */}
                        {success && <div className="alert alert-success">{success}</div>}
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nome:</label>
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Digite o nome"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">E-mail:</label>
                                <input
                                    type="email"
                                    className="form-control bg-light"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite o e-mail"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Senha:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Senha do usuário"
                                />
                            </div>

                            <button type="submit" className="btn btn-success">Cadastrar</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}

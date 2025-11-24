import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function TelaUsuario() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [deleteUserId, setDeleteUserId] = useState(null);

    // Carregar usuário autenticado via JWT
    useEffect(() => {
        api.get("/me")
            .then((res) => setUser(res.data))
            .catch(() => {
                localStorage.removeItem("token");
                navigate("/");
            })
            .finally(() => setLoading(false));
    }, []);

    // Logout JWT — só remove token
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

        const handleDelete = async () => {
            try {
                const response = await api.delete(`/user/${deleteUserId}`);

                alert("Usuário deletado com sucesso!");

                localStorage.removeItem("token");
                navigate("/");

            } catch (error) {
                console.error(error);
                alert("Erro ao deletar usuário");
            }
        };

    if (loading) return <h2>Carregando...</h2>;
    if (!user) return <h2>Usuário não encontrado</h2>;

    return (
        <div className="bg-light min-vh-100">

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                        <span
                            className="navbar-brand text-light"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/inicio")}   // <--- redireciona!
                        >
                            Marca I
                        </span>


                    <button className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#logoutModal">
                        Sair
                    </button>
                </div>
            </nav>

            <div className="container mt-5">
                <h3>Perfil do Usuário</h3>

                {/* Card de informações */}
                <div className="card shadow-sm my-4">
                    <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>ID:</strong> {user.id}</p>
                    </div>
                </div>

                {/* Botões */}
                <div className="card shadow-sm p-4">
                    <div className="d-flex justify-content-between align-items-center">

                        <button
                            className="btn btn-danger"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteModal"
                            onClick={() => setDeleteUserId(user.id)}
                        >
                            Deletar Usuário
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/usuario/editar`)}
                        >
                            Editar Usuário
                        </button>

                    </div>
                </div>
            </div>

            {/* Modal Logout */}
            <div className="modal fade" id="logoutModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
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

            {/* Modal Delete */}
            <div className="modal fade" id="deleteModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">Confirmar Exclusão</h5>
                            <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            Tem certeza que deseja excluir sua conta?
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button className="btn btn-danger" onClick={handleDelete}>Excluir</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function EditarConta() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [conta, setConta] = useState({
        descricao: "",
        preco: "",
        data_vencimento: "",
        data_pagamento: "",
        status: "Aberta",
    });

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Função para formatar datas para Laravel
    const formatDate = (date) => {
        if (!date) return null;
        // datetime-local -> "2025-11-24T12:30" -> "2025-11-24 12:30:00"
        return date.replace("T", " ") + ":00";
    };

    // Buscar conta pelo ID via API
    useEffect(() => {
        api.get(`/contas/${id}`)
            .then((res) => {
                const data = res.data;
                setConta({
                    descricao: data.descricao || "",
                    preco: data.preco || "",
                    data_vencimento: data.data_vencimento
                        ? new Date(data.data_vencimento).toISOString().slice(0, 16)
                        : "",
                    data_pagamento: data.data_pagamento
                        ? new Date(data.data_pagamento).toISOString().slice(0, 16)
                        : "",
                    status: data.status || "Aberta",
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                alert("Erro ao carregar a conta.");
                navigate("/inicio");
            });
    }, [id]);

    // Atualizar campos
    const handleChange = (e) => {
        setConta({ ...conta, [e.target.name]: e.target.value });
    };

    // Submeter alteração
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const payload = {
            ...conta,
            data_vencimento: formatDate(conta.data_vencimento),
            data_pagamento: formatDate(conta.data_pagamento),
        };

        try {
            await api.put(`/contas/${id}/update-json`, payload);
            alert("Conta atualizada com sucesso!");
            navigate(`/conta/${id}`);
        } catch (err) {
            console.log(err.response); // Mostra o que veio do backend
            if (err.response?.status === 422) {
                setErrors(Object.values(err.response.data.errors).flat());
            } else if (err.response?.data?.error) {
                setErrors([err.response.data.error]);
            } else {
                setErrors(["Erro inesperado ao salvar a conta"]);
            }
        }
    };

    if (loading) return <div className="container mt-5">Carregando...</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Editar Conta</h4>
                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={() => navigate("/inicio")}
                    >
                        Voltar
                    </button>
                </div>

                <div className="card-body">
                    {errors.length > 0 && (
                        <div className="alert alert-danger">
                            <strong>Erro!</strong>
                            <ul className="mb-0">
                                {errors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="descricao" className="form-label">
                                Descrição
                            </label>
                            <input
                                type="text"
                                id="descricao"
                                name="descricao"
                                className="form-control"
                                value={conta.descricao}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="preco" className="form-label">
                                Preço (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="preco"
                                name="preco"
                                className="form-control"
                                value={conta.preco}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="data_vencimento" className="form-label">
                                    Data de Vencimento
                                </label>
                                <input
                                    type="datetime-local"
                                    id="data_vencimento"
                                    name="data_vencimento"
                                    className="form-control"
                                    value={conta.data_vencimento}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="data_pagamento" className="form-label">
                                    Data de Pagamento
                                </label>
                                <input
                                    type="datetime-local"
                                    id="data_pagamento"
                                    name="data_pagamento"
                                    className="form-control"
                                    value={conta.data_pagamento}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">
                                Status
                            </label>
                            <select
                                name="status"
                                id="status"
                                className="form-select"
                                value={conta.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Aberta">Aberta</option>
                                <option value="Quitada">Quitada</option>
                            </select>
                        </div>

                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(`/conta/${id}`)}
                            >
                                Cancelar
                            </button>

                            <button type="submit" className="btn btn-success">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

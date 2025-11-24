import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as bootstrap from "bootstrap";

export default function TelaInicio() {
  const navigate = useNavigate();
  const [contas, setContas] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const [total, setTotal] = useState(0);
  const [contaExcluir, setContaExcluir] = useState(null);

  // Filtros
  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [filtroVencimentoInicial, setFiltroVencimentoInicial] = useState("");
  const [filtroVencimentoFinal, setFiltroVencimentoFinal] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get("http://127.0.0.1:8000/api/user-logado", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data.auth) {
          navigate("/");
        } else {
          carregarContas();
        }
      } catch (err) {
        console.error("Erro ao verificar login:", err);
        navigate("/");
      }
    };

    verificarLogin();
  }, []);

  const carregarContas = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/contas-json", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const contasFormatadas = res.data.contas.map((c) => ({
        ...c,
        vencFormatado: new Date(c.data_vencimento).toLocaleString("pt-BR"),
        pagFormatado: c.data_pagamento
          ? new Date(c.data_pagamento).toLocaleString("pt-BR")
          : "-",
      }));

      setContas(contasFormatadas);

      const soma = contasFormatadas.reduce(
        (acc, c) => acc + parseFloat(c.preco),
        0
      );

      setTotal(soma);
    } catch (err) {
      console.error("Erro ao carregar contas:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  // Filtros aplicados
  const aplicarFiltros = () => {
    return contas.filter((c) => {
      const descricaoMatch = c.descricao
        .toLowerCase()
        .includes(filtroDescricao.toLowerCase());

      const vencimento = new Date(c.data_vencimento);
      const inicial = filtroVencimentoInicial ? new Date(filtroVencimentoInicial) : null;
      const final = filtroVencimentoFinal ? new Date(filtroVencimentoFinal) : null;
      const vencimentoMatch =
        (!inicial || vencimento >= inicial) && (!final || vencimento <= final);

      const statusMatch = !filtroStatus || c.status === filtroStatus;

      return descricaoMatch && vencimentoMatch && statusMatch;
    });
  };

  const contasFiltradas = aplicarFiltros();
  const totalPaginas = Math.ceil(contasFiltradas.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const contasPaginadas = contasFiltradas.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPaginas) return;
    setPaginaAtual(page);
  };

  const excluirConta = async () => {
    if (!contaExcluir) return;
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/contas/${contaExcluir}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContaExcluir(null);
      carregarContas();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("confirmDeleteModal")
      );
      modal.hide();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Erro ao excluir conta.");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-light" href="/inicio">
            Marca I
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="btn btn-success btn-sm" href="/usuario">
                  Usuário
                </a>
              </li>
              <li className="nav-item ms-3">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    new bootstrap.Modal(
                      document.getElementById("logoutModal")
                    ).show();
                  }}
                >
                  Sair
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Contas a Pagar</h3>
          <a href="/conta/adicionar" className="btn btn-success">
            + Adicionar
          </a>
        </div>

        <h5 className="mb-3">
          Total:{" "}
          <strong>
            R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </strong>
        </h5>

        {/* FILTROS DE PESQUISA */}
        <div className="card p-3 mb-4 shadow-sm">
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Descrição"
                value={filtroDescricao}
                onChange={(e) => setFiltroDescricao(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Vencimento Inicial"
                onFocus={(e) => (e.target.type = "date")}
                value={filtroVencimentoInicial}
                onChange={(e) => setFiltroVencimentoInicial(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Vencimento Final"
                onFocus={(e) => (e.target.type = "date")}
                value={filtroVencimentoFinal}
                onChange={(e) => setFiltroVencimentoFinal(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-control"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="Aberta">Aberta</option>
                <option value="Quitada">Quitada</option>
              </select>
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-dark w-50" onClick={() => setPaginaAtual(1)}>
                Buscar
              </button>
              <button
                className="btn btn-danger w-50"
                onClick={() => {
                  setFiltroDescricao("");
                  setFiltroVencimentoInicial("");
                  setFiltroVencimentoFinal("");
                  setFiltroStatus("");
                  setPaginaAtual(1);
                }}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* TABELA */}
        <div className="table-responsive shadow-sm">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Id</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Data de Vencimento</th>
                <th>Data de Pagamento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contasPaginadas.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.descricao}</td>
                  <td>R$ {parseFloat(c.preco).toFixed(2)}</td>
                  <td>{c.vencFormatado}</td>
                  <td>{c.pagFormatado}</td>
                  <td>
                    {c.status === "Quitada" ? (
                      <span className="badge bg-success">Quitada</span>
                    ) : (
                      <span className="badge bg-info text-dark">Aberta</span>
                    )}
                  </td>
                  <td className="d-flex gap-2">
                    <a href={`/conta/${c.id}`} className="btn btn-warning btn-sm">
                      👁 Ver
                    </a>
                    <a href={`/conta/${c.id}/editar`} className="btn btn-primary btn-sm">
                      ✏ Editar
                    </a>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setContaExcluir(c.id);
                        new bootstrap.Modal(
                          document.getElementById("confirmDeleteModal")
                        ).show();
                      }}
                    >
                      🗑 Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <nav className="d-flex justify-content-center my-3">
          <ul className="pagination">
            <li className={`page-item ${paginaAtual === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => changePage(paginaAtual - 1)}>
                Anterior
              </button>
            </li>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <li key={i} className={`page-item ${paginaAtual === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => changePage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${paginaAtual === totalPaginas ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => changePage(paginaAtual + 1)}>
                Próxima
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* MODAL CONFIRMAR EXCLUSÃO */}
      <div className="modal fade" id="confirmDeleteModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Excluir Conta</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">Tem certeza que deseja excluir esta conta?</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button className="btn btn-danger" onClick={excluirConta}>Excluir</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL LOGOUT */}
      <div className="modal fade" id="logoutModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-warning">
              <h5 className="modal-title">Encerrar Sessão</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">Tem certeza que deseja sair da sua conta?</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button className="btn btn-warning" onClick={handleLogout}>Sair</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

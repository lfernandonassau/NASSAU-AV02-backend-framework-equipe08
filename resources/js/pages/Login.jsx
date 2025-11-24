import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        //  salva token JWT
        localStorage.setItem("token", data.token);

        //  redireciona
        navigate("/inicio");
      } 
      else if (res.status === 401) {
        alert("E-mail ou senha incorretos!");
      } 
      else {
        alert("Erro inesperado ao fazer login!");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao conectar ao servidor!");
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-light" href="/">
            Marca I
          </a>
        </div>
      </nav>

      <div
        className="container d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="col-12 col-md-8 col-lg-5">
          <div className="p-4 border rounded shadow-sm bg-white">
            <h1 className="text-center mb-4">Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">E-mail:</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  placeholder="Digite o e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Senha:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Senha do usuário"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-between">
                <a href="/create.user" className="btn btn-success">
                  Cadastrar
                </a>
                <button type="submit" className="btn btn-primary">
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

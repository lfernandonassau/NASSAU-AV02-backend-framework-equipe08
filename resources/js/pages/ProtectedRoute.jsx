import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
    // Se não houver token, redireciona para login
        return <Navigate to="/" replace />;
    }

    return children;
}

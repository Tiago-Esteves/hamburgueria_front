import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const locked = (label: string) => ({
        "aria-disabled": "true",
        title: "Em breve — " + label,
        onClick: (e: React.MouseEvent) => e.preventDefault(),
    });

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="brand">
                    <div className="logo">🍔</div>
                    <div>
                        <h1>Hamburgueria</h1>
                        <p className="subtitle">Painel de controle</p>
                    </div>
                </div>
            </header>

            <main className="home-main">
                <h2 className="welcome">Bem-vindo</h2>
                <p className="lead">Gerencie ingredientes, produtos e acompanhe seu negócio.</p>

                <div className="home-grid">
                    <div className="action-card">
                        <button onClick={() => navigate("/ingredientes")} aria-label="Ver Ingredientes">
                            Ver Ingredientes
                        </button>
                        <small>Adicionar, editar e listar ingredientes</small>
                    </div>

                    <div className="action-card">
                        <button onClick={() => navigate("/produtos")} aria-label="Ver Produtos">
                            Ver Produtos
                        </button>
                        <small>Gerenciar produtos e composições</small>
                    </div>

                    <div className="action-card locked" {...locked("Pedidos")}>
                        <button disabled>Pedidos 🔒</button>
                        <small>Funcionalidade em desenvolvimento</small>
                    </div>

                    <div className="action-card locked" {...locked("Gastos")}>
                        <button disabled>Gastos 🔒</button>
                        <small>Funcionalidade em desenvolvimento</small>
                    </div>

                    <div className="action-card locked" {...locked("Dados")}>
                        <button disabled>Dados 🔒</button>
                        <small>Relatórios e métricas — em breve</small>
                    </div>
                </div>
            </main>

            <footer className="home-footer">
                <small>© {new Date().getFullYear()} Hamburgueria — Painel Administrativo</small>
            </footer>
        </div>
    );
};

export default HomePage;
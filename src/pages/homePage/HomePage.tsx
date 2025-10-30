import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import HeaderComponent from "../../components/header/HeaderComponent";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const locked = (label: string) => ({
        "aria-disabled": true,                 // booleano
        title: `Em breve — ${label}`,
        onClick: (e: React.MouseEvent) => e.preventDefault(),
        tabIndex: -1,                          // não focalizável
    });

    return (
        <div className="home-page">
            <HeaderComponent />

            <main className="home-main">
                <h2 className="welcome">Bem-vindo</h2>
                <p className="lead">Gerencie ingredientes, produtos e acompanhe seu negócio.</p>

                <div className="home-grid">
                    <div className="action-card">
                        <button onClick={() => navigate("/ingredientes")} aria-label="Ver Ingredientes">
                            Ingredientes
                        </button>
                        <small>Adicionar, editar e listar ingredientes</small>
                    </div>

                    <div className="action-card">
                        <button onClick={() => navigate("/produtos")} aria-label="Ver Produtos">
                            Produtos
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
                        <button disabled={true}>Dados 🔒</button>
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
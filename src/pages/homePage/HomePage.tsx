import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <h1 className="header">Bem-vindo</h1>
            <div className="botoes-container">
                <button onClick={() => navigate("/ingredientes")}>Ver Ingredientes</button>
                <button onClick={() => navigate("/produtos")}>Ver Produtos</button>
            </div>
        </div>
    );
};

export default HomePage;
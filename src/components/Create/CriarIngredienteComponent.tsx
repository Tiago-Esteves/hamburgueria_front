import React from "react";
import "./Criar.css";
import "../../pages/homePage/HomePage.css"; // <-- para estilos de botão
import * as ingredienteService from '../../services/ingredienteService';
import type { Ingrediente } from "../../services/ingredienteService";

const CriarIngredienteComponent: React.FC<{ onClose: () => void, onCreated: () => void }> = ({ onClose, onCreated }) => {
    const [nome, setNome] = React.useState("");
    const [preco, setPreco] = React.useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const novoIngrediente: Ingrediente = { id: 0, nome, preco };
        try {
            await ingredienteService.createIngrediente(novoIngrediente);
            console.log("Criar Ingrediente:", { nome, preco });
            onClose();
            onCreated();
            alert("Ingrediente criado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar ingrediente:", error);
        }
    };

    return (
        <div className="modal-container">
            <header className="brand" style={{ marginBottom: 12 }}>
                <div className="logo" style={{ width: 36, height: 36, fontSize: 18 }}>🍔</div>
                <div style={{ marginLeft: 8 }}>
                    <h2 style={{ margin: 0 }}>Criar Ingrediente</h2>
                </div>
            </header>
            <form onSubmit={handleSubmit} className="form-container">
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="preco">Preço:</label>
                    <input type="number" id="preco" name="preco" required value={preco} onChange={(e) => setPreco(Number(e.target.value))} />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button className="btn-primary" type="submit">Criar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CriarIngredienteComponent;
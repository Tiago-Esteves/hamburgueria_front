import React from "react";
import "./Criar.css";
import * as ingredienteService from '../services/ingredienteService';
import type { Ingrediente } from "../services/ingredienteService";

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
        <div className="form-container">
            <h2>Criar Ingrediente</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="preco">Preço:</label>
                    <input type="number" id="preco" name="preco" required value={preco} onChange={(e) => setPreco(Number(e.target.value))} />
                </div>
                <button type="submit">Criar</button>
                <button type="button" onClick={onClose}>Cancelar</button>
            </form>
        </div>
    );
};

export default CriarIngredienteComponent;
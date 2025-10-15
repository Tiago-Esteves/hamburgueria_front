import React, { useEffect } from "react";
import "./List.css";
import * as ingredienteService from '../services/ingredienteService';
import type { Ingrediente } from "../services/ingredienteService";
import CriarIngredienteComponent from "../components/CriarIngredienteComponent";
import Modal from "react-modal";

const ListIngredientesPage: React.FC = () => {
    const [ingredientes, setIngredientes] = React.useState<Ingrediente[]>([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    useEffect(() => {
        async function carregarIngredientes() {
            const dados = await ingredienteService.getAllIngredientes();
            setIngredientes(dados);
        }
        carregarIngredientes();
    }, []);

    const formatPrice = (v: number | string | undefined) => {
        if (v === null || v === undefined || v === "") return "-";
        const n = Number(v);
        if (!Number.isFinite(n)) return "-";
        return n.toFixed(2);
    };

    return (
        <div className="list-container">
            <h1>Lista de Ingredientes</h1>
            <div className="ingrediente-container">
                
                <table className="prod-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Preço Unitário</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredientes.map((ingrediente) => (
                            <tr key={ingrediente.id}>
                                <td>{ingrediente.nome}</td>
                                <td>{formatPrice(ingrediente.preco)}</td>
            
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => setModalIsOpen(true)}>Criar Ingrediente</button>
            <Modal className="modal-content" overlayClassName="modal-overlay" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <CriarIngredienteComponent onClose={() => setModalIsOpen(false)} />
            </Modal>
        </div>
    );
};

export default ListIngredientesPage;

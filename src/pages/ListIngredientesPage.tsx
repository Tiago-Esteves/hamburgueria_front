import React, { useEffect, useState } from "react";
import * as ingredienteService from "../services/ingredienteService";
import type { Ingrediente } from "../services/ingredienteService";
import CriarIngredienteComponent from "../components/CriarIngredienteComponent";
import Modal from "react-modal";
import "./List.css";

const TelaListIngredientes: React.FC = () => {
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const carregarIngredientes = async () => {
        try {
            const resp = await ingredienteService.getAllIngredientes();
            setIngredientes(resp);
        } catch (err) {
            console.error("Erro ao carregar ingredientes:", err);
        }
    };

    useEffect(() => {
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
            <h1 className="titulo">Lista de Ingredientes</h1>

            <div className="prod-container">
                <div className="table-wrapper">
                    <table className="prod-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Preço</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredientes.map((ing) => (
                                <tr key={ing.id}>
                                    <td>{ing.nome}</td>
                                    <td>{formatPrice(ing.preco)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="prod-cards" role="list">
                    {ingredientes.map((ing) => (
                        <article className="produto-card" key={ing.id} role="listitem">
                            <header className="card-header">
                                <h3>{ing.nome}</h3>
                            </header>
                            <div className="card-body">
                                <div className="card-row"><span className="muted">Preço:</span> {formatPrice(ing.preco)}</div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <button className="btn-primary" onClick={() => setModalIsOpen(true)}>Criar Ingrediente</button>

            <Modal className="modal-content" overlayClassName="modal-overlay" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <CriarIngredienteComponent
                    onClose={() => setModalIsOpen(false)}
                    onCreated={() => { carregarIngredientes(); setModalIsOpen(false); }}
                />
            </Modal>
        </div>
    );
};

export default TelaListIngredientes;

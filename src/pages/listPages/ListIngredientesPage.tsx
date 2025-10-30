import React, { useEffect, useState } from "react";
import * as ingredienteService from "../../services/ingredienteService";
import type { Ingrediente } from "../../services/ingredienteService";
import CriarIngredienteComponent from "../../components/CriarIngredienteComponent";
import Modal from "react-modal";
import "./List.css";
import "../../components/Criar.css"
import "../../pages/homePage/HomePage.css"
import HeaderComponent from "../../components/header/HeaderComponent";

Modal.setAppElement('#root');

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
            <HeaderComponent />
            <main className="home-main">
                <h1 className="titulo">Lista de Ingredientes</h1>

                <div className="cards-container" role="list">
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

                <button className="btn-primary" onClick={() => setModalIsOpen(true)}>Criar Ingrediente</button>

                <Modal className="modal-content" overlayClassName="modal-overlay" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                    <CriarIngredienteComponent
                        onClose={() => setModalIsOpen(false)}
                        onCreated={() => { carregarIngredientes(); setModalIsOpen(false); }}
                    />
                </Modal>
            </main>


        </div>
    );
};

export default TelaListIngredientes;

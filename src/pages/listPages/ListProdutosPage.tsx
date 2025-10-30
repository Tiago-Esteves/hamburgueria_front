import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import CriarProdutoComponent from "../../components/CriarProdutoComponent";
import ProdutoComponent from "../../components/ProdutoComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import "../homePage/HomePage.css"; // <-- aplicar estilo da home
import type { Produto } from "../../services/produtoService";
import * as produtoService from "../../services/produtoService";
import "./List.css";

const TelaListProdutos: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [modalCriarIsOpen, setModalCriarIsOpen] = useState(false);
    const [modalProdIsOpen, setModalProdIsOpen] = useState(false);
    const [selectedProdutoId, setSelectedProdutoId] = useState<number | null>(null);

    const carregarProdutos = async () => {
        try {
            const response = await produtoService.getProdutos();
            setProdutos(response);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    };

    useEffect(() => {
        carregarProdutos();
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
                <h1 className="titulo">Lista de Produtos</h1>

                <div className="cards-container" role="list">
                    {produtos.map((produto) => (
                        <button
                            className="produto-card"
                            key={produto.id}
                            role="listitem"
                            onClick={() => { setSelectedProdutoId(produto.id); setModalProdIsOpen(true); }}
                        >
                            <header className="card-header">
                                <h3>{produto.nome}</h3>
                            </header>
                            <div className="card-body">
                                <div className="div-prices">
                                    <div className="card-row"><span className="muted">Custo:</span> {formatPrice(produto.custoUnitario)}</div>
                                    <div className="card-row"><span className="muted">Venda:</span> {formatPrice(produto.precoVenda)}</div>
                                </div>

                                <div className="card-row"><span className="muted">Ingredientes:</span> {produto.ingredientes?.map(i => i.nome).join(', ') || 'Nenhum'}</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Modal único para visualizar/editar produto selecionado */}
                <Modal
                    className="modal-content"
                    overlayClassName="modal-overlay"
                    isOpen={modalProdIsOpen}
                    onRequestClose={() => { setModalProdIsOpen(false); setSelectedProdutoId(null); }}
                >
                    <ProdutoComponent produtoId={selectedProdutoId ?? undefined} onClose={() => { setModalProdIsOpen(false); setSelectedProdutoId(null); carregarProdutos(); }} />
                </Modal>

                <button className="btn-primary" onClick={() => setModalCriarIsOpen(true)}>Criar Produto</button>

                <Modal className="modal-content" overlayClassName="modal-overlay" isOpen={modalCriarIsOpen} onRequestClose={() => setModalCriarIsOpen(false)}>
                    <CriarProdutoComponent onClose={() => setModalCriarIsOpen(false)} onCreated={() => { carregarProdutos(); }} />
                </Modal>
            </main>
        </div>
    );
};

export default TelaListProdutos;


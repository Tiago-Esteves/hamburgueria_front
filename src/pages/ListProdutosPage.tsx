import React, { useEffect, useState } from "react";
import *  as produtoService from "../services/produtoService";
import type { Produto } from "../services/produtoService";
import CriarProdutoComponent from "../components/CriarProdutoComponent";
import Modal from "react-modal";
import "./List.css";

const TelaListProdutos: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]); // define o estado para armazenar os produtos com o tipo Produto[]
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
            <h1 className="titulo">Lista de Produtos</h1>

            <div className="prod-container">
                <table className="prod-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Preço Unitário</th>
                            <th>Preço de Venda</th>
                            <th>Ingredientes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((produto) => (
                            <tr key={produto.id}>
                                <td>{produto.nome}</td>
                                <td>{formatPrice(produto.custoUnitario)}</td>
                                <td>{formatPrice(produto.precoVenda)}</td>
                                <td>{produto.ingredientes?.map(i => i.nome).join(', ') || 'Nenhum'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <button onClick={() => setModalIsOpen(true)}>Criar Produto</button>
            <Modal className="modal-content" overlayClassName="modal-overlay" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <CriarProdutoComponent onClose={() => setModalIsOpen(false)} onCreated={() => { carregarProdutos();  }} />
            </Modal>
        </div>
    );
};

export default TelaListProdutos;


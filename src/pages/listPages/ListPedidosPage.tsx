/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import CriarPedidoComponent from "../../components/Create/CriarPedidoComponent";
import PedidoComponent from "../../components/Entidade/PedidoComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import "../homePage/HomePage.css";
import type { Pedido } from "../../services/pedidoService";
import * as pedidoService from "../../services/pedidoService";
import "./List.css";

const ListPedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [modalCriarIsOpen, setModalCriarIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);

  const carregarPedidos = async () => {
    try {
      const response = await pedidoService.getPedidos();
      setPedidos(response ?? []);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    }
  };

  useEffect(() => {
    carregarPedidos();
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
        <h1 className="titulo">Lista de Pedidos</h1>

        <div className="cards-container" role="list">
          {pedidos.map((pedido) => (
            <button
              className="produto-card"
              key={pedido.id}
              role="listitem"
              onClick={() => {
                setSelectedPedidoId(pedido.id);
                setModalEditIsOpen(true);
              }}
            >
              <header className="card-header">
                <h3>Pedido #{pedido.id} — {pedido.nomeCliente ?? "-"}</h3>
              </header>

              <div className="card-body">
                <div className="card-row">
                  <span className="muted">Cliente:</span> {pedido.nomeCliente ?? "-"}
                </div>
                <div className="card-row">
                  <span className="muted">Preço:</span> {formatPrice((pedido as any).total ?? (pedido as any).preco ?? undefined)}
                </div>
                <div className="card-row">
                  <span className="muted">Status:</span> {pedido.status ?? "-"}
                </div>
              </div>
            </button>
          ))}
        </div>

        <Modal
          className="modal-content"
          overlayClassName="modal-overlay"
          isOpen={modalEditIsOpen}
          onRequestClose={() => {
            setModalEditIsOpen(false);
            setSelectedPedidoId(null);
          }}
        >
          <PedidoComponent
            pedidoId={selectedPedidoId ?? undefined}
            onClose={() => {
              setModalEditIsOpen(false);
              setSelectedPedidoId(null);
              carregarPedidos();
            }}
          />
        </Modal>

        <button className="btn-primary" onClick={() => setModalCriarIsOpen(true)}>
          Criar Pedido
        </button>

        <Modal
          className="modal-content"
          overlayClassName="modal-overlay"
          isOpen={modalCriarIsOpen}
          onRequestClose={() => setModalCriarIsOpen(false)}
        >
          <CriarPedidoComponent
            onClose={() => setModalCriarIsOpen(false)}
            onCreated={() => {
              setModalCriarIsOpen(false);
              carregarPedidos();
            }}
          />
        </Modal>
      </main>
    </div>
  );
};

export default ListPedidosPage;
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import CriarIngredienteComponent from "../../components/Create/CriarIngredienteComponent";
import IngredienteComponent from "../../components/Entidade/IngredienteComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import "../homePage/HomePage.css"; // <-- aplicar estilo da home
import type { Ingrediente } from "../../services/ingredienteService";
import * as ingredienteService from "../../services/ingredienteService";
import "./List.css";

const TelaListIngredientes: React.FC = () => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [modalCriarIsOpen, setModalCriarIsOpen] = useState(false);
  const [modalIngredIsOpen, setModalIngredIsOpen] = useState(false);
  const [selectedIngredienteId, setSelectedIngredienteId] = useState<number | null>(null);

  const carregarIngredientes = async () => {
    try {
      const response = await ingredienteService.getAllIngredientes();
      setIngredientes(response ?? []);
    } catch (error) {
      console.error("Erro ao carregar ingredientes:", error);
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
            <button
              className="produto-card"
              key={ing.id}
              role="listitem"
              onClick={() => {
                setSelectedIngredienteId(ing.id);
                setModalIngredIsOpen(true);
              }}
            >
              <header className="card-header">
                <h3>{ing.nome}</h3>
              </header>
              <div className="card-body">
                <div className="card-row">
                  <span className="muted">Preço:</span> {formatPrice(ing.preco)}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Modal único para visualizar/editar ingrediente selecionado */}
        <Modal
          className="modal-content"
          overlayClassName="modal-overlay"
          isOpen={modalIngredIsOpen}
          onRequestClose={() => {
            setModalIngredIsOpen(false);
            setSelectedIngredienteId(null);
          }}
        >
          <IngredienteComponent
            ingredienteId={selectedIngredienteId ?? undefined}
            onClose={() => {
              setModalIngredIsOpen(false);
              setSelectedIngredienteId(null);
              carregarIngredientes();
            }}
          />
        </Modal>

        <button className="btn-primary" onClick={() => setModalCriarIsOpen(true)}>
          Criar Ingrediente
        </button>

        <Modal
          className="modal-content"
          overlayClassName="modal-overlay"
          isOpen={modalCriarIsOpen}
          onRequestClose={() => setModalCriarIsOpen(false)}
        >
          <CriarIngredienteComponent
            onClose={() => setModalCriarIsOpen(false)}
            onCreated={() => {
              setModalCriarIsOpen(false);
              carregarIngredientes();
            }}
          />
        </Modal>
      </main>
    </div>
  );
};

export default TelaListIngredientes;

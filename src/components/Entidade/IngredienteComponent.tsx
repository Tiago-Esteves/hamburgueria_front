import React, { useEffect, useState } from "react";
import type { Ingrediente } from "../../services/ingredienteService";
import * as ingredienteService from "../../services/ingredienteService";

type Props = {
  ingredienteId?: number;
  onClose: () => void;
};

const IngredienteComponent: React.FC<Props> = ({ ingredienteId, onClose }) => {
  const [ing, setIng] = useState<Ingrediente | null>(null);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newIngrediente: Omit<Ingrediente, "id"> = {
      nome,
      preco,
    };

    if (ingredienteId) {
      await ingredienteService.updateIngrediente(ingredienteId, newIngrediente);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!ingredienteId) return;
    const ok = window.confirm("Deseja realmente deletar este ingrediente?");
    if (!ok) return;
    try {
      await ingredienteService.deleteIngrediente(ingredienteId);
      onClose();
    } catch (err) {
      console.error("Erro ao deletar ingrediente:", err);
      alert("Erro ao deletar ingrediente. Veja o console para mais detalhes.");
    }
  };

  useEffect(() => {
    const carregarIngrediente = async (id: number) => {
      try {
        const response = await ingredienteService.getIngredienteById(id);
        setIng(response);
        setNome(response.nome);
        setPreco(Number(response.preco) || 0);
      } catch (error) {
        console.error("Erro ao carregar ingrediente:", error);
      }
    };
    if (ingredienteId) {
      carregarIngrediente(ingredienteId);
    }
  }, [ingredienteId]);

  return (
    <div style={{ padding: 16, minWidth: 360 }}>
      <h2>{ing ? "Editar Ingrediente" : "Novo Ingrediente"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div>
          <label style={{ display: "block", fontWeight: 600 }}>ID</label>
          <div>{ing ? ing.id : "-"}</div>
        </div>

        <label>
          Nome
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </label>

        <label>
          Preço
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value === "" ? 0 : Number(e.target.value))}
            required
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>Fechar</button>
          {ingredienteId && (
            <button
              type="button"
              onClick={handleDelete}
              style={{ background: "#e55353", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6 }}
            >
              Deletar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default IngredienteComponent;

import React, { useEffect, useState } from "react";
import * as ingredienteService from '../services/ingredienteService';
import * as produtoService from "../services/produtoService";
import type { Produto } from "../services/produtoService";
import type { Ingrediente } from '../services/ingredienteService';


  type ProdutoComponentProps = {
    produtoId?: number;
    onClose: () => void;
  };

const ProdutoComponent: React.FC<ProdutoComponentProps> = ({ produtoId, onClose }) => {

  const [produto, setProduto] = useState<Produto | null>(null);
  const [allIngredientes, setAllIngredientes] = useState<Ingrediente[]>([]);
  const [selectedIngredienteIds, setSelectedIngredienteIds] = useState<number[]>([]);
  const [nome, setNome] = useState("");
  const [custoUnitario, setCustoUnitario] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProduto: Omit<Produto, "id"> = {
      nome,
      custoUnitario,
      precoVenda: produto ? produto.precoVenda : 0,
      ingredientes: produto ? produto.ingredientes : [],
    };

    if (produtoId) {
      await produtoService.updateProduto(produtoId, newProduto);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!produtoId) return;
    const ok = window.confirm("Deseja realmente deletar este produto?");
    if (!ok) return;
    try {
      await produtoService.deleteProduto(produtoId);
      onClose();
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      alert("Erro ao deletar produto. Veja o console para mais detalhes.");
    }
  };
  
  useEffect(() => {
    const carregarIngredientes = async () => {
      try {
        const response = await ingredienteService.getAllIngredientes();
        setAllIngredientes(response);
      } catch (error) {
        console.error("Erro ao carregar ingredientes:", error);
      }
    };

    carregarIngredientes();
  }, []);

  useEffect(() => {
  const carregarProduto = async (produtoId: number) => {
    try {
      const response = await produtoService.getProdutoById(produtoId);
      setProduto(response);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
    }
  };
    if (produtoId) {
      carregarProduto(produtoId);
    }
  }, [produtoId]);

  return (
    <div style={{ padding: 16, minWidth: 360 }}>
      <h2>{produto ? "Editar Produto" : "Novo Produto"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div>
          <label style={{ display: "block", fontWeight: 600 }}>ID</label>
          <div>{produto ? produto.id : "-"}</div>
        </div>

        <label>
          Nome
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </label>

        <label>
          Custo unitário
          <input
            type="number"
            step="0.01"
            value={custoUnitario}
            onChange={(e) => setCustoUnitario(e.target.value === "" ? 0 : Number(e.target.value))}
          />
        </label>

        <div>
          <label style={{ display: "block", fontWeight: 600 }}>Ingredientes</label>
          <div className="list-ingredientes" style={{ maxHeight: 200, overflow: "auto", padding: 8 }}>
            {allIngredientes.length === 0 && <div>Nenhum ingrediente disponível</div>}
            {allIngredientes.map((ing) => {
              const checked = selectedIngredienteIds.includes(ing.id);
              return (
                <label key={ing.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    value={ing.id}
                    checked={checked}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const newSelected = e.target.checked
                        ? [...selectedIngredienteIds, id]
                        : selectedIngredienteIds.filter((x) => x !== id);

                      setSelectedIngredienteIds(newSelected);

                      const novoCusto = allIngredientes
                        .filter((i) => newSelected.includes(i.id))
                        .reduce((sum, it) => sum + Number(it.preco ?? 0), 0);
                      setCustoUnitario(Number(novoCusto.toFixed(2)));
                    }}
                  />
                  <span>{ing.nome} ({Number(ing.preco ?? 0).toFixed(2)})</span>
                </label>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" >Salvar</button>
          <button type="button" onClick={() => onClose()}>Fechar</button>
          {produtoId && (
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

export default ProdutoComponent;

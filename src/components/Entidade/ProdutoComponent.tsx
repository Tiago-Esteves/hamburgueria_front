/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { Ingrediente } from '../../services/ingredienteService';
import * as ingredienteService from '../../services/ingredienteService';
import type { Produto } from "../../services/produtoService";
import * as produtoService from "../../services/produtoService";


type ProdutoComponentProps = {
  produtoId?: number;
  onClose: () => void;
};

const ProdutoComponent: React.FC<ProdutoComponentProps> = ({ produtoId, onClose }) => {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [allIngredientes, setAllIngredientes] = useState<Ingrediente[]>([]);
  // quantidade por ingrediente id
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});
  const [nome, setNome] = useState("");
  const [custoUnitario, setCustoUnitario] = useState(0);
  const [precoVenda, setPrecoVenda] = useState(0);

  const setQuantidade = (id: number, qty: number) => {
    setQuantidades(prev => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;

      const novoCusto = allIngredientes
        .reduce((sum, ing) => sum + (Number(next[ing.id] ?? 0) * Number(ing.preco ?? 0)), 0);
      setCustoUnitario(Number(novoCusto.toFixed(2)));
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoCusto = allIngredientes
      .reduce((sum, ing) => sum + (Number(quantidades[ing.id] ?? 0) * Number(ing.preco ?? 0)), 0);

    const newProduto: Omit<Produto, "id"> = {
      nome,
      custoUnitario: Number(novoCusto.toFixed(2)),
      precoVenda,
      ingredientes: produto ? produto.ingredientes : [],
    };

    if (!produtoId) return;

    try {
      await produtoService.updateProduto(produtoId, newProduto);

      // reconciliação das associações: adiciona conforme quantidades (mantém mesmo comportamento do CriarProduto)
      const idsToAdd: number[] = [];
      for (const [idStr, qty] of Object.entries(quantidades)) {
        const id = Number(idStr);
        for (let i = 0; i < qty; i++) idsToAdd.push(id);
      }

      if (idsToAdd.length > 0) {
        try {
          await Promise.all(idsToAdd.map((id) => produtoService.addIngredientesToProduto(produtoId, id)));
        } catch (err) {
          console.error("Erro ao adicionar ingredientes ao produto:", err);
        }
      }

      onClose();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      alert("Erro ao salvar produto. Veja o console para mais detalhes.");
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
        setAllIngredientes(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Erro ao carregar ingredientes:", error);
      }
    };

    carregarIngredientes();
  }, []);

  useEffect(() => {
    const carregarProduto = async (id: number) => {
      try {
        const response = await produtoService.getProdutoById(id);
        setProduto(response);
        setNome(response.nome ?? "");
        setPrecoVenda(response.precoVenda ?? 0);
        setCustoUnitario(Number((response.custoUnitario ?? 0).toFixed(2)));

        // popula quantidades contando ocorrências do ingrediente na resposta
        const counts: Record<number, number> = {};
        if (Array.isArray(response.ingredientes)) {
          response.ingredientes.forEach((ing: any) => {
            const ingId = typeof ing === "number" ? ing : (ing && typeof ing === "object" ? (ing.id ?? undefined) : undefined);
            if (typeof ingId === "number") counts[ingId] = (counts[ingId] ?? 0) + 1;
          });
        }
        setQuantidades(counts);
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
          Preço de venda
          <input
            type="number"
            step="0.01"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value === "" ? 0 : Number(e.target.value))}
          />
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
          <div className="list-ingredientes" style={{ maxHeight: 280, overflow: "auto", padding: 8 }}>
            {allIngredientes.length === 0 && <div>Nenhum ingrediente disponível</div>}
            {allIngredientes.map((ing) => {
              const qty = quantidades[ing.id] ?? 0;
              return (
                <div key={ing.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <strong>{ing.nome}</strong> <span>({Number(ing.preco ?? 0).toFixed(2)})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      aria-label={`Diminuir ${ing.nome}`}
                      onClick={() => setQuantidade(ing.id, Math.max(0, qty - 1))}
                      style={{ width: 32, height: 32 }}
                    >
                      −
                    </button>

                    <div style={{ minWidth: 36, textAlign: 'center' }}>{qty}</div>

                    <button
                      type="button"
                      aria-label={`Aumentar ${ing.nome}`}
                      onClick={() => setQuantidade(ing.id, qty + 1)}
                      style={{ width: 32, height: 32 }}
                    >
                      +
                    </button>
                  </div>
                </div>
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

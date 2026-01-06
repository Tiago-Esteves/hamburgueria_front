import React, { useEffect } from "react";
import "./Criar.css";
import "../../pages/homePage/HomePage.css";
import * as produtoService from "../../services/produtoService";
import * as pedidoService from "../../services/pedidoService";
import type { Produto } from "../../services/produtoService";
import type { Pedido } from "../../services/pedidoService";

const CriarPedidoComponent: React.FC<{ onClose: () => void; onCreated: () => void }> = ({ onClose, onCreated }) => {
  const [nomeCliente, setNomeCliente] = React.useState("");
  const [status, setStatus] = React.useState<Pedido["status"]>("PENDENTE");
  const [total, setTotal] = React.useState(0);
  const [allProdutos, setAllProdutos] = React.useState<Produto[]>([]);
  const [quantidades, setQuantidades] = React.useState<Record<number, number>>({});

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const dados = await produtoService.getProdutos();
        setAllProdutos(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }
    carregarProdutos();
  }, []);

  const setQuantidade = (id: number, qty: number) => {
    setQuantidades((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      const novoTotal = allProdutos.reduce((sum, p) => sum + (Number(next[p.id] ?? 0) * Number(p.precoVenda ?? 0)), 0);
      setTotal(Number(novoTotal.toFixed(2)));
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoTotal = allProdutos.reduce((sum, p) => sum + (Number(quantidades[p.id] ?? 0) * Number(p.precoVenda ?? 0)), 0);

    const novoPedido: Omit<Pedido, "id"> = {
      nomeCliente,
      produtos: [],
      preco: Number(novoTotal.toFixed(2)),
      status,
      data: new Date(),
    };

    try {
      const criado = await pedidoService.createPedido(novoPedido);
      console.log("Pedido criado:", criado);

      // cria associações repetidas conforme quantidades
      const idsToAdd: number[] = [];
      for (const [idStr, qty] of Object.entries(quantidades)) {
        const id = Number(idStr);
        for (let i = 0; i < qty; i++) idsToAdd.push(id);
      }

      if (idsToAdd.length > 0) {
        try {
          await Promise.all(idsToAdd.map((id) => pedidoService.addProdutoToPedido(criado.id, id)));
        } catch (err) {
          console.error("Erro ao adicionar produtos ao pedido:", err);
        }
      }

      // atualiza total (campo `preco` no model Pedido)
      try {
        await pedidoService.updatePedido(criado.id, { preco: Number(novoTotal.toFixed(2)) } as never);
      } catch (err) {
        console.warn("Falha ao atualizar total do pedido:", err);
      }

      onClose();
      onCreated();
      alert("Pedido criado com sucesso! Total: R$ " + novoTotal.toFixed(2));
    } catch (err) {
      console.error("Erro ao criar pedido", err);
      alert("Erro ao criar pedido");
    }
  };

  return (
    <div className="form-container">
      <header className="brand" style={{ marginBottom: 12 }}>
        <div className="logo" style={{ width: 36, height: 36, fontSize: 18 }}>🧾</div>
        <div style={{ marginLeft: 8 }}>
          <h2 style={{ margin: 0 }}>Criar Pedido</h2>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nomeCliente">Nome do Cliente:</label>
          <input
            type="text"
            id="nomeCliente"
            name="nomeCliente"
            required
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            required
            value={status}
            onChange={(e) => setStatus(e.target.value as Pedido["status"])}
          >
            <option value="PENDENTE">PENDENTE</option>
            <option value="EM_PREPARO">EM_PREPARO</option>
            <option value="PRONTO">PRONTO</option>
            <option value="ENTREGUE">ENTREGUE</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>

        <div>
          <label>Produtos:</label>
          <div className="list-ingredientes">
            {allProdutos.length === 0 && <div>Nenhum produto disponível</div>}
            {allProdutos.map((p) => {
              const qty = quantidades[p.id] ?? 0;
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <strong>{p.nome}</strong> <span>({Number(p.precoVenda ?? 0).toFixed(2)})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      aria-label={`Diminuir ${p.nome}`}
                      onClick={() => setQuantidade(p.id, Math.max(0, qty - 1))}
                      style={{ width: 32, height: 32 }}
                    >
                      −
                    </button>

                    <div style={{ minWidth: 36, textAlign: 'center' }}>{qty}</div>

                    <button
                      type="button"
                      aria-label={`Aumentar ${p.nome}`}
                      onClick={() => setQuantidade(p.id, qty + 1)}
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

        <div>
          <label htmlFor="total">Total:</label>
          <label style={{ marginLeft: 8 }}>{total.toFixed(2)}</label>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn-primary" type="submit">Criar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CriarPedidoComponent;

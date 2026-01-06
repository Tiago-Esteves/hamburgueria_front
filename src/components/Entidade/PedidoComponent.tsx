import React, { useEffect, useState } from "react";
import type { Produto } from "../../services/produtoService";
import * as produtoService from "../../services/produtoService";
import type { Pedido } from "../../services/pedidoService";
import * as pedidoService from "../../services/pedidoService";

type Props = {
  pedidoId?: number;
  onClose: () => void;
};

const PedidoComponent: React.FC<Props> = ({ pedidoId, onClose }) => {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [allProdutos, setAllProdutos] = useState<Produto[]>([]);
  const [selectedProdutoIds, setSelectedProdutoIds] = useState<number[]>([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [status, setStatus] = useState<Pedido["status"]>("PENDENTE");
  const [total, setTotal] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProdutos = allProdutos.filter((p) => selectedProdutoIds.includes(p.id));
    const novoTotal = selectedProdutos.reduce((s, p) => s + Number(p.precoVenda ?? 0), 0);

    const newPedido: Omit<Pedido, "id"> = {
      nomeCliente,
      // envia produtos com shape mínima contendo id
      produtos: selectedProdutoIds.map(id => ({ id } as unknown as Produto)),
      preco: Number(novoTotal.toFixed(2)),
      status,
      data: pedido ? pedido.data : new Date(),
    };

    if (pedidoId) {
      try {
        await pedidoService.updatePedido(pedidoId, newPedido);
        onClose();
      } catch (err) {
        console.error("Erro ao salvar pedido:", err);
        alert("Erro ao salvar pedido. Veja o console para mais detalhes.");
      }
    }
  };

  const handleDelete = async () => {
    if (!pedidoId) return;
    const ok = window.confirm("Deseja realmente deletar este pedido?");
    if (!ok) return;
    try {
      await pedidoService.deletePedido(pedidoId);
      onClose();
    } catch (err) {
      console.error("Erro ao deletar pedido:", err);
      alert("Erro ao deletar pedido. Veja o console para mais detalhes.");
    }
  };

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await produtoService.getProdutos();
        setAllProdutos(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    carregarProdutos();
  }, []);

  useEffect(() => {
    const carregarPedido = async (id: number) => {
      try {
        const response = await pedidoService.getPedidoById(id);
        setPedido(response);

        // sincroniza formulário com os dados carregados
        setNomeCliente(response.nomeCliente ?? "");
        setStatus(response.status ?? "PENDENTE");
        setTotal(Number(response.preco ?? 0));

        // popula selectedProdutoIds com os ids presentes em response.produtos
        const ids: number[] = [];
        if (Array.isArray(response.produtos)) {
          response.produtos.forEach((prd) => {
            const prdId =
              typeof prd === "number"
                ? prd
                : prd && typeof prd === "object"
                ? (prd as any).id
                : undefined;
            if (typeof prdId === "number") ids.push(prdId);
          });
        }
        // remove duplicados (se quiser manter duplicados, troque para lógica de quantidades)
        setSelectedProdutoIds(Array.from(new Set(ids)));
      } catch (error) {
        console.error("Erro ao carregar pedido:", error);
      }
    };
    if (pedidoId) {
      carregarPedido(pedidoId);
    }
  }, [pedidoId]);

  return (
    <div style={{ padding: 16, minWidth: 360 }}>
      <h2>{pedido ? `Editar Pedido #${pedido.id}` : "Novo Pedido"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div>
          <label style={{ display: "block", fontWeight: 600 }}>ID</label>
          <div>{pedido ? pedido.id : "-"}</div>
        </div>

        <label>
          Nome do cliente
          <input value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} required />
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as Pedido["status"])}>
            <option value="PENDENTE">PENDENTE</option>
            <option value="EM_PREPARO">EM_PREPARO</option>
            <option value="PRONTO">PRONTO</option>
            <option value="ENTREGUE">ENTREGUE</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </label>

        <div>
          <label style={{ display: "block", fontWeight: 600 }}>Produtos</label>
          <div className="list-ingredientes" style={{ maxHeight: 200, overflow: "auto", padding: 8 }}>
            {allProdutos.length === 0 && <div>Nenhum produto disponível</div>}
            {allProdutos.map((p) => {
              const checked = selectedProdutoIds.includes(p.id);
              return (
                <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    value={p.id}
                    checked={checked}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const newSelected = e.target.checked
                        ? [...selectedProdutoIds, id]
                        : selectedProdutoIds.filter((x) => x !== id);

                      setSelectedProdutoIds(newSelected);

                      const novoTotal = allProdutos
                        .filter((prd) => newSelected.includes(prd.id))
                        .reduce((sum, it) => sum + Number(it.precoVenda ?? 0), 0);
                      setTotal(Number(novoTotal.toFixed(2)));
                    }}
                  />
                  <span>{p.nome} — R$ {Number(p.precoVenda ?? 0).toFixed(2)}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="card-row"><span className="muted">Total:</span> R$ {Number(total).toFixed(2)}</div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => onClose()}>Fechar</button>
          {pedidoId && (
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

export default PedidoComponent;

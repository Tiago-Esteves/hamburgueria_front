import React, { useEffect } from "react";
import "./Criar.css";
import "../../pages/homePage/HomePage.css"; // <-- para usar .btn-primary etc.
import * as produtoService from "../../services/produtoService";
import * as ingredienteService from '../../services/ingredienteService';
import type { Produto } from "../../services/produtoService";
import type { Ingrediente } from "../../services/ingredienteService";

const CriarProdutoComponent: React.FC<{ onClose: () => void, onCreated: () => void }> = ({ onClose, onCreated }) => {
    const [nome, setNome] = React.useState("");
    const [precoVenda, setPrecoVenda] = React.useState(0);
    const [custoUnitario, setCustoUnitario] = React.useState(0);
    const [allIngredientes, setAllIngredientes] = React.useState<Ingrediente[]>([]);
    // agora guarda quantidade por ingrediente (id -> qty)
    const [quantidades, setQuantidades] = React.useState<Record<number, number>>({});

    useEffect(() => {
        async function carregarIngredientes() {
            try {
                const dados = await ingredienteService.getAllIngredientes();
                setAllIngredientes(Array.isArray(dados) ? dados : []);
            } catch (error) {
                console.error("Erro ao carregar ingredientes:", error);
            }
        }
        carregarIngredientes();
    }, []);

    const setQuantidade = (id: number, qty: number) => {
        setQuantidades(prev => {
            const next = { ...prev };
            if (qty <= 0) delete next[id];
            else next[id] = qty;
            // recalcula custoUnitario
            const novoCusto = allIngredientes
                .reduce((sum, ing) => sum + (Number(next[ing.id] ?? 0) * Number(ing.preco ?? 0)), 0);
            setCustoUnitario(Number(novoCusto.toFixed(2)));
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // calcula custo com base nas quantidades atuais
        const novoCusto = allIngredientes
            .reduce((sum, ing) => sum + (Number(quantidades[ing.id] ?? 0) * Number(ing.preco ?? 0)), 0);

        const novoProduto: Omit<Produto, "id"> = {
            nome,
            custoUnitario: Number(novoCusto.toFixed(2)),
            precoVenda,
            ingredientes: [], // mantemos a associação separada como no seu modelo
        };

        try {
            const criado = await produtoService.createProduto(novoProduto);
            console.log("Produto criado:", criado);

            // cria as associações repetidas conforme quantidade
            const idsToAdd: number[] = [];
            for (const [idStr, qty] of Object.entries(quantidades)) {
                const id = Number(idStr);
                for (let i = 0; i < qty; i++) idsToAdd.push(id);
            }

            if (idsToAdd.length > 0) {
                try {
                    await Promise.all(idsToAdd.map((id) => produtoService.addIngredientesToProduto(criado.id, id)));
                } catch (err) {
                    console.error("Erro ao adicionar ingredientes ao produto:", err);
                    // não interrompe o fluxo principal
                }
            }

            onClose();
            onCreated();
            alert("Produto criado com sucesso!");

        } catch (err) {
            console.error("Erro ao criar produto", err);
            alert("Erro ao criar produto");
        }
    };

    return (
        <div className="form-container">
            <header className="brand" style={{ marginBottom: 12 }}>
                <div className="logo" style={{ width: 36, height: 36, fontSize: 18 }}>🍔</div>
                <div style={{ marginLeft: 8 }}>
                    <h2 style={{ margin: 0 }}>Criar Produto</h2>
                </div>
            </header>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="precoVenda">Preço de Venda:</label>
                    <input
                        type="number"
                        id="precoVenda"
                        name="precoVenda"
                        required
                        step="any"
                        value={precoVenda}
                        onChange={(e) => setPrecoVenda(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label htmlFor="custoUnitario">Custo Unitário:</label>
                    <label>{custoUnitario.toFixed(2)}</label>
                </div>
                <div>
                    <label>Ingredientes:</label>
                    <div className="list-ingredientes">
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

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button className="btn-primary" type="submit">Criar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </div>
             </form>
         </div>
     );
};

export default CriarProdutoComponent;

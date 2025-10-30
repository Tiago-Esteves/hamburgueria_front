import React, { useEffect } from "react";
import "./Criar.css";
import "../pages/homePage/HomePage.css"; // <-- para usar .btn-primary etc.
import * as produtoService from "../services/produtoService";
import * as ingredienteService from '../services/ingredienteService';
import type { Produto } from "../services/produtoService";
import type { Ingrediente } from "../services/ingredienteService";

const CriarProdutoComponent: React.FC<{ onClose: () => void, onCreated: () => void }> = ({ onClose, onCreated }) => {
    const [nome, setNome] = React.useState("");
    const [precoVenda, setPrecoVenda] = React.useState(0);
    const [custoUnitario, setCustoUnitario] = React.useState(0);
    const [allIngredientes, setAllIngredientes] = React.useState<Ingrediente[]>([]);
    const [selectedIngredienteIds, setSelectedIngredienteIds] = React.useState<number[]>([]);

    useEffect(() => {
        async function carregarIngredientes() {
            try {
                const dados = await ingredienteService.getAllIngredientes();
                setAllIngredientes(dados);
            } catch (error) {
                console.error("Erro ao carregar ingredientes:", error);
            }
        }
        carregarIngredientes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const novoProduto: Omit<Produto, "id"> = {
            nome,
            custoUnitario: allIngredientes.reduce((sum, ing) => sum + ing.preco, 0),            
            precoVenda,
            ingredientes: [],
        };

        try {
            const criado = await produtoService.createProduto(novoProduto);
            console.log("Produto criado:", criado);

            if (selectedIngredienteIds.length > 0) {
                try {
                    await Promise.all(
                        selectedIngredienteIds.map((id) => produtoService.addIngredientesToProduto(criado.id, id))
                    );
                } catch (err) {
                    console.error("Erro ao adicionar ingredientes ao produto:", err);
                    // não interrompe o fluxo principal; você pode avisar o usuário se preferir
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
                    <label htmlFor="precoUnitario">Preço Unitário:</label>
                    <label>{custoUnitario}</label>
                </div>
                <div>
                    <label>Ingredientes:</label>
                    <div className="list-ingredientes">
                        {allIngredientes.length === 0 && <div>Nenhum ingrediente disponível</div>}
                        {allIngredientes.map((ing) => {
                            const checked = selectedIngredienteIds.includes(ing.id);
                            return (
                                <label key={ing.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input
                                        type="checkbox"
                                        value={ing.id}
                                        checked={checked}
                                        onChange={(e) => {
                                            const id = Number(e.target.value);
                                            const newSelected = e.target.checked
                                                ? [...selectedIngredienteIds, id]
                                                : selectedIngredienteIds.filter(x => x !== id);

                                            setSelectedIngredienteIds(newSelected);

                                            // recalcula o custo unitário baseado nos ingredientes selecionados
                                            const novoCusto = allIngredientes
                                                .filter(i => newSelected.includes(i.id))
                                                .reduce((sum, it) => sum + Number(it.preco), 0);
                                            setCustoUnitario(Number(novoCusto.toFixed(2)));
                                        }}
                                    />
                                    <span>{ing.nome} ({ing.preco.toFixed(2)})</span>
                                </label>
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

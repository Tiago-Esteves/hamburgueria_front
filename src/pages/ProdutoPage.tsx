import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import * as produtoService from "../services/produtoService";
import type { Produto } from "../services/produtoService";


const TelaProduto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      if (id) {
        const produtoData = await produtoService.getProdutoById(Number(id));
        setProduto(produtoData);
      }
    };
    fetchProduto();
  }, [id]);

  return (
    <div>
      <h1>Tela do Produto</h1>
      {produto ? (
        <div>
          <p>ID: {produto.id}</p>
          <p>Nome: {produto.nome}</p>
          <p>Preço de venda: R$ {produto.precoVenda.toFixed(2)}</p>
          {/* <p>Preço unitário: R$ {produto.precoUnitario.toFixed(2)}</p> */}
          <h3>Ingredientes:</h3>
          <ul>
            {produto.ingredientes.map((i) => (
              <li key={i.id}>{i.nome}</li>
            ))}
          </ul>
          <button onClick={() => navigate("/criar-ingrediente")}>Adicionar Ingrediente</button>
        </div>
      ) : (
        <p>Carregando produto...</p>
      )}
    </div>
  );
};

export default TelaProduto;

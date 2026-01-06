import axios from 'axios';
import type { Produto } from './produtoService';

const API_URL = `${import.meta.env.VITE_API_URL}/pedidos`;

export interface Pedido {
    id: number;
    nomeCliente: string;
    produtos: Produto[];
    preco: number;
    status: 'PENDENTE' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';
    data: Date;
}

export const getPedidos = async (): Promise<Pedido[]> => {
    const response = await axios.get<Pedido[]>(API_URL);
    return response.data;
}

export const getPedidoById = async (id: number): Promise<Pedido> => {
    const response = await axios.get<Pedido>(`${API_URL}/${id}`);
    return response.data;
}

export const createPedido = async (pedido: Omit<Pedido, 'id'>): Promise<Pedido> => {
    const response = await axios.post<Pedido>(API_URL, pedido);
    return response.data;
}

export const updatePedido = async (id: number, pedido: Omit<Pedido, 'id'>): Promise<Pedido> => {
    const response = await axios.put<Pedido>(`${API_URL}/${id}`, pedido);
    return response.data;
}

export const addProdutoToPedido = async (pedidoId: number, produtoId: number): Promise<Pedido> => {
    const response = await axios.post<Pedido>(`${API_URL}/${pedidoId}/produto/${produtoId}`);
    return response.data;
}

export const deletePedido = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
}

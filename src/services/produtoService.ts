import axios from 'axios';
import type { Ingrediente } from './ingredienteService';

const API_URL = `${import.meta.env.VITE_API_URL}/produto`;

export interface Produto {
  id: number;
  nome: string;
  custoUnitario: number;
  precoVenda: number;
  ingredientes: Ingrediente[];
}


export const getProdutos = async (): Promise<Produto[]> => {
  const response = await axios.get<Produto[]>(API_URL);
  return response.data;
}

export const getProdutoById = async (id: number): Promise<Produto> => {
  const response = await axios.get<Produto>(`${API_URL}/${id}`);
  return response.data;
} 

export const createProduto = async (produto: Omit<Produto, 'id'>): Promise<Produto> => {
  const response = await axios.post<Produto>(API_URL, produto);
  return response.data;
}

export const addIngredientesToProduto = async (produtoId: number, ingredienteId: number): Promise<Produto> => {
  const response = await axios.post<Produto>(`${API_URL}/${produtoId}/ingrediente/${ingredienteId}`);
  return response.data;
}

export const updateProduto = async (id: number, produto: Omit<Produto, 'id'>): Promise<Produto> => {
  const response = await axios.put<Produto>(`${API_URL}/${id}`, produto);
  return response.data;
}

export const deleteProduto = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
} 


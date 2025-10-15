import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/ingrediente`;

// Tipagem alinhada com a entidade do backend
export interface Ingrediente {
  id: number;
  nome: string;
  preco: number;
}

export const getAllIngredientes = async (): Promise<Ingrediente[]> => {
  const response = await axios.get<Ingrediente[]>(API_URL);
  return response.data;
};

export const getIngredienteById = async (id: number): Promise<Ingrediente> => {
  const response = await axios.get<Ingrediente>(`${API_URL}/${id}`);
  return response.data;
};

export const createIngrediente = async (
  ingrediente: Omit<Ingrediente, "id">
): Promise<Ingrediente> => {
  const response = await axios.post<Ingrediente>(API_URL, ingrediente);
  return response.data;
};

export const updateIngrediente = async (
  id: number,
  ingrediente: Omit<Ingrediente, "id">
): Promise<Ingrediente> => {
  const response = await axios.put<Ingrediente>(`${API_URL}/${id}`, ingrediente);
  return response.data;
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

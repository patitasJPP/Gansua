import axios from "axios";

const API_URL = "https://gansua.onrender.com/api";
export const apiService = {
  // GET: 'R' representa el tipo de la respuesta que esperas recibir
  async get<R>(url: string): Promise<R> {
    try {
      const response = await axios.get<R>(`${API_URL}/${url}`);
      return response.data;
    } catch (error) {
      console.error("Error GET:", error);
      throw error;
    }
  },
  //GET_ID:pedimos solo los datos por id
  async getID<R>(url: string, id: string): Promise<R> {
    try {
      const response = await axios.get<R>(`${API_URL}/${url}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error GET:", error);
      throw error;
    }
  },

  // POST: 'T' es el tipo de data que envías, 'R' es el tipo de la respuesta
  async post<T, R = unknown>(url: string, data: T): Promise<R> {
    try {
      const response = await axios.post<R>(`${API_URL}/${url}`, data);
      return response.data;
    } catch (error) {
      console.error("Error POST:", error);
      throw error;
    }
  },

  // PUT: Igual que POST, requiere una data de tipo 'T'
  async put<T, R = unknown>(url: string, data: T): Promise<R> {
    try {
      const response = await axios.put<R>(`${API_URL}/${url}`, data);
      return response.data;
    } catch (error) {
      console.error("Error PUT:", error);
      throw error;
    }
  },

  // DELETE: Puede devolver una respuesta de tipo 'R'
  async delete<R>(url: string): Promise<R> {
    try {
      const response = await axios.delete<R>(`${API_URL}/${url}`);
      return response.data;
    } catch (error) {
      console.error("Error DELETE:", error);
      throw error;
    }
  },
};

import axios from "axios";
import { api } from "./api";
import type { LoginRequestDTO, LoginResponseDTO } from "../types/auth";
export const auth = {

    async login (data: LoginRequestDTO) {
        try {
            const response = await api.post<LoginResponseDTO>("/gerenciador/auth/login", data);
            const { token } = response.data;
    
            localStorage.setItem("@dica-api:token", token);
            localStorage.setItem("@Dica API:token", token);
            console.log("Token armazenado com sucesso:");
            return response.data;
    
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.message && error.response?.data?.status) {
                const errorStatus = error.response.data.status;
                console.log("Erro ao fazer login:", error.response.data.status, error.response.data.message);
                if (errorStatus === 401) {
                    throw new Error('Credenciais inválidas. Por favor, verifique seu email e senha e tente novamente.');
                }
            }
            throw new Error('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
        }
    },

    async logout() {
        localStorage.removeItem("@dica-api:token");
        localStorage.removeItem("@Dica API:token");
    }
}
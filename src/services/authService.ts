import axios from 'axios';
import { api } from './api';
import type { ChangePasswordRequestDTO, LoginRequestDTO, LoginResponseDTO } from '../types/auth';

const login = async (data: LoginRequestDTO) => {
    try {
        console.log('Iniciando processo de login para email:', data.email);
        const response = await api.post<LoginResponseDTO>('gerenciador/auth/login', data);
        const { token } = response.data;

        localStorage.setItem('@dica-api:token', token);
        localStorage.setItem('@Dica API:token', token);
        console.log('Token armazenado com sucesso:');
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.message && error.response?.data?.status) {
            const errorStatus = error.response.data.status;
            console.log('Erro ao fazer login:', error.response.data.status, error.response.data.message);
            if (errorStatus === 401) {
                throw new Error('Credenciais inválidas. Por favor, verifique seu email e senha e tente novamente.');
            }
        }

        throw new Error('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
    }
};

const logout = async () => {
    localStorage.removeItem('@dica-api:token');
    localStorage.removeItem('@Dica API:token');
};

const changePassword = async (data: ChangePasswordRequestDTO) => {
    const token = localStorage.getItem('@dica-api:token') ?? localStorage.getItem('@Dica API:token');

    try {
        await api.put('gerenciador/usuario/senha', data, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 400 && typeof message === 'string' && message.trim()) {
                throw new Error(message);
            }

            if (status === 401) {
                throw new Error('Senha atual inválida. Verifique os dados e tente novamente.');
            }
        }

        throw new Error('Não foi possível alterar a senha. Tente novamente.');
    }
};

export const auth = {
    login,
    logout,
    changePassword,
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MailIcon, LockIcon, EyeIcon, InfoIcon } from '../../../components/icons/iconLogin';
import { auth } from '../../../services/authService';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
    
        try {
            await auth.login({ email, password });
            navigate('../dashboard');
        } catch (error) {
            setErro(error.response?.data?.message || 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
        }
    };

    const [showPassword, setShowPassword] = useState(false);


    return (
        <div className="flex min-h-screen w-full bg-[#DADADA]">
            <div className="flex items-center justify-center w-6/10">
                <img
                    src="/src/assets/loginScreenImage.png"
                    alt="Login Imagem"
                    className="w-full max-w-[582px] h-auto object-contain"
                />
            </div>

            <div className="w-4/10 bg-white flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
                    <div>
                        <h2 className="text-2xl font-medium text-center text-[28px] mb-1">
                            Entrar
                        </h2>
                        <p className="text-gray-600 text-center font-medium text-[14px]">
                            Bem-vindo! Por favor, entre com suas credenciais.
                        </p>
                    </div>
                    <div className="mb-4 mt-6">
                        <div className="flex items-center gap-x-3 bg-neutral-50 border border-neutral-200 rounded-3xl shadow-md p-3 px-4 w-full transition-shadow focus-within:ring-2 focus-within:ring-blue-300">
                            <MailIcon />

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 bg-transparent text-lg text-neutral-800 placeholder:text-neutral-500 outline-none focus:ring-0"
                            />
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="relative flex items-center gap-x-3 bg-neutral-50 border border-neutral-200 rounded-3xl shadow-md p-3 px-4 w-full transition-shadow focus-within:ring-2 focus-within:ring-blue-300">
                            
                            <LockIcon />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex-1 bg-transparent text-lg text-neutral-800 placeholder:text-neutral-500 outline-none focus:ring-0 pr-10" // pr-10 para dar espaço ao olho
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-neutral-500 hover:text-neutral-700"
                            >
                                <EyeIcon />
                            </button>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-x-2.2 text-sm text-neutral-500'>
                            <InfoIcon />
                            <a href="/forgot-password" className="text-[#4703D0] hover:text-[#4703D0]/80">
                                Esqueceu sua senha?
                            </a>
                        </div>
                        <div className='flex items-center'>
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-[#4703D0] focus:ring-[#4703D0]" />
                            <span className="ml-2 text-sm">Lembrar-me</span>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-[#0069AD] text-[#FBFBFB] text-[17px] font-semibold  py-3 rounded-3xl mt-7 hover:bg-[#4703D0]/90 transition-colors">
                            Entrar
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                        <h1 className="text-[17px]">
                            Não tem uma conta? <a href="/register" className="text-[#4703D0] hover:text-[#4703D0]/80">Entre em contato com o time de desenvolvimento</a>
                        </h1>
                    </div>
                    {erro && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6 mt-6">
                            <p className="text-red-900 font-medium text-sm">{erro}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
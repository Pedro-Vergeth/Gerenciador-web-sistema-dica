import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/auth/login/index.tsx';
import Dashboard from './pages/main/dashboard/index.tsx';
import EditFoodPage from './pages/main/alimentos/edit.tsx';
import FoodsPage from './pages/main/alimentos/index.tsx';
import EditUserPage from './pages/main/usuarios/edit.tsx';
import UsersPage from './pages/main/usuarios/index.tsx';
import EditRecipePage from './pages/main/receitas/edit.tsx';
import RecipesPage from './pages/main/receitas/index.tsx';
import EditVideoPage from './pages/main/videos/edit.tsx';
import VideosPage from './pages/main/videos/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main/dashboard" element={<Dashboard />} />
        <Route path="/main/usuarios" element={<UsersPage />} />
        <Route path="/main/usuarios/edit/:id" element={<EditUserPage />} />
        <Route path="/main/alimentos" element={<FoodsPage />} />
        <Route path="/main/alimentos/edit/:id" element={<EditFoodPage />} />
        <Route path="/main/receitas" element={<RecipesPage />} />
        <Route path="/main/receitas/edit/:id" element={<EditRecipePage />} />
        <Route path="/main/videos" element={<VideosPage />} />
        <Route path="/main/videos/edit/:id" element={<EditVideoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
import React from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';
const MOCK_EMAIL = 'teste@estudai.com';
const MOCK_PASSWORD = '123456';


export default function Login({ onShowRegister }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error('Email ou senha inválidos.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="login-title">Conecte-se</h2>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email obrigatório' })}
            className={errors.email ? 'input-error' : ''}
            autoComplete="username"
          />
          {errors.email && <span className="error-msg">{errors.email.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Senha obrigatória' })}
            className={errors.password ? 'input-error' : ''}
            autoComplete="current-password"
          />
          {errors.password && <span className="error-msg">{errors.password.message}</span>}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
          <button type="submit">Entrar</button>
          <button type="button" className="register-btn" onClick={onShowRegister}>Cadastre-se</button>
        </div>
      </form>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar theme="colored" />
    </div>
  );
}

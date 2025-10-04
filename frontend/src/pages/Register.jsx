import React from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/register.css';


export default function Register({ onShowLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = ({ name, email, password }) => {
    // Recupera usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const alreadyExists = users.some(u => u.email === email);
    if (alreadyExists) {
      toast.error('Este e-mail já está registrado.');
    } else {
      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      toast.success('Registro realizado com sucesso!');
      setTimeout(() => {
        if (onShowLogin) onShowLogin();
      }, 1200);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="register-title">Crie sua conta</h2>
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Nome obrigatório' })}
            className={errors.name ? 'input-error' : ''}
            autoComplete="name"
          />
          {errors.name && <span className="error-msg">{errors.name.message}</span>}
        </div>
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
            {...register('password', {
              required: 'Senha obrigatória',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' }
            })}
            className={errors.password ? 'input-error' : ''}
            autoComplete="new-password"
          />
          {errors.password && <span className="error-msg">{errors.password.message}</span>}
        </div>
  <button type="submit" style={{ width: '100%' }}>Criar conta</button>
  <button type="button" className="register-link" onClick={onShowLogin} style={{ width: '100%', marginTop: '1em' }}>Já tem conta? Entrar</button>
      </form>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar theme="colored" />
    </div>
  );
}

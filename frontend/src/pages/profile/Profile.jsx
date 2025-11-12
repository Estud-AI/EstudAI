import React, { useState, useEffect } from 'react';
import './Profile.css';
import api from '../../api/api';
import { getAuth, setAuth } from '../../auth/auth';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para edição
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const authData = getAuth();
      if (!authData || !authData.user || !authData.user.id) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      const userId = authData.user.id;
      const response = await api.get(`/api/user/profile/${userId}`);
      
      if (response.data.ok) {
        setUser(response.data.profile);
        setEditName(response.data.profile.name);
        setEditPhone(response.data.profile.phoneNumber || '');
      } else {
        setError('Falha ao carregar perfil');
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      setError('Falha ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const authData = getAuth();
      const userId = authData.user.id;

      const response = await api.put(`/api/user/profile/${userId}`, {
        name: editName,
        phoneNumber: editPhone || null
      });

      if (response.data.ok) {
        // Atualizar estado local
        setUser(prev => ({
          ...prev,
          name: editName,
          phoneNumber: editPhone
        }));

        // Atualizar localStorage
        const updatedAuthData = {
          ...authData,
          user: {
            ...authData.user,
            name: editName
          }
        };
        setAuth(updatedAuthData);

        setIsEditing(false);
        alert('Perfil atualizado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditName(user.name);
    setEditPhone(user.phoneNumber || '');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Meu Perfil</h1>
          <p className="profile-subtitle">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Meu Perfil</h1>
          <p className="profile-subtitle" style={{ color: 'red' }}>{error || 'Dados do usuário não disponíveis'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Meu Perfil</h1>
        <p className="profile-subtitle">Gerencie sua conta e acompanhe seu progresso</p>
      </div>

      <div className="profile-content">
        <div className="profile-left-column">
          <div className="profile-card">
            <div className="profile-avatar">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            
            {isEditing ? (
              <div className="profile-edit-form">
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="profile-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="profile-input disabled"
                  />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="profile-input"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="profile-name">{user.name}</h2>
                <p className="profile-email">{user.email}</p>
                {user.phoneNumber && (
                  <p className="profile-phone">📱 {user.phoneNumber}</p>
                )}
                <p className="profile-joined">Membro desde {new Date(user.joinedDate).toLocaleDateString('pt-BR')}</p>
                {user.dayStreak > 0 && (
                  <p className="profile-streak">🔥 {user.dayStreak} dias de sequência!</p>
                )}
              </>
            )}
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button 
                  className="action-btn primary" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
                <button 
                  className="action-btn secondary" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancelar
                </button>
              </>
            ) : (
              <button className="action-btn primary full-width" onClick={() => setIsEditing(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        <div className="profile-right-column">
          <h3 className="stats-title">Suas Estatísticas</h3>
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{user.stats.subjects}</div>
                <div className="stat-label">Matérias</div>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 3h2a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{user.stats.flashcards}</div>
                <div className="stat-label">Flashcards</div>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{user.stats.quizzesCompleted || 0}</div>
                <div className="stat-label">Testes Feitos</div>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-value">{user.dayStreak || 0}</div>
                <div className="stat-label">Dias de Ofensiva</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
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
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Meu Perfil</h1>
          <p className="text-lg text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Meu Perfil</h1>
          <p className="text-lg text-red-600">{error || 'Dados do usuário não disponíveis'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Meu Perfil</h1>
        <p className="text-lg text-gray-600 leading-relaxed">Gerencie sua conta e acompanhe seu progresso</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=120`}
                  alt={user.name}
                  className="w-30 h-30 rounded-full shadow-lg ring-4 ring-blue-50"
                />
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                {user.phoneNumber && (
                  <p className="text-gray-600 flex items-center justify-center gap-2">
                    <span>📱</span> {user.phoneNumber}
                  </p>
                )}
                <p className="text-sm text-gray-500 pt-2">
                  Membro desde {new Date(user.joinedDate).toLocaleDateString('pt-BR')}
                </p>
                {user.dayStreak > 0 && (
                  <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full font-semibold mt-4">
                    <span className="text-xl">🔥</span>
                    <span>{user.dayStreak} dias de sequência!</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button 
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
                <button 
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <button 
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
                onClick={() => setIsEditing(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Suas Estatísticas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Stat Card - Matérias */}
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-400">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <svg className="text-blue-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600">{user.stats.subjects}</div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Matérias</div>
                </div>
              </div>
            </div>

            {/* Stat Card - Flashcards */}
            <div className="bg-white border-2 border-green-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-green-400">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <svg className="text-green-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 3h2a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600">{user.stats.flashcards}</div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Flashcards</div>
                </div>
              </div>
            </div>

            {/* Stat Card - Testes */}
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-purple-400">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-50 rounded-xl">
                  <svg className="text-purple-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600">{user.stats.quizzesCompleted || 0}</div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Testes Feitos</div>
                </div>
              </div>
            </div>

            {/* Stat Card - Ofensiva */}
            <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-400">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-50 rounded-xl">
                  <svg className="text-orange-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-600">{user.dayStreak || 0}</div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Dias de Ofensiva</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

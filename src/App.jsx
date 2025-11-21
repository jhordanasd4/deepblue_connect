import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Arrecife from './components/Arrecife';
import Mercado from './components/Mercado';
import RecargaModal from './components/RecargaModal';
import RetiroModal from './components/RetiroModal';
import FondoMarinoModal from './components/FondoMarinoModal';
import AdminDashboard from './components/AdminDashboard';
import marketItems from './constants/marketItems';

const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:3000';

function App() {
  // Estado del usuario autenticado (null = no autenticado)
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [sessionRestored, setSessionRestored] = useState(false);
  // Lista global simple de usuarios registrados
  const [users, setUsers] = useState([]);
  // Lista de solicitudes de recarga
  const [rechargeRequests, setRechargeRequests] = useState([]);
  // Flag para saber si ya cargamos datos iniciales
  const [dataLoaded, setDataLoaded] = useState(false);
  // Estado para controlar la visibilidad del Mercado
  const [mostrarMercado, setMostrarMercado] = useState(false);
  // Estado para recarga cuando faltan Gotas
  const [mostrarRecarga, setMostrarRecarga] = useState(false);
  const [recargaItem, setRecargaItem] = useState(null);
  const [mostrarRetiro, setMostrarRetiro] = useState(false);
  const [mostrarFondo, setMostrarFondo] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);

  // Restaurar sesión al iniciar la app con validación de token
  // Usamos sessionStorage en lugar de localStorage para aislar sesiones por pestaña/ventana
  useEffect(() => {
    const restoreSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');
      if (refCode) {
        sessionStorage.removeItem('deepblue_session');
        sessionStorage.removeItem('deepblue_role');
        sessionStorage.removeItem('deepblue_token');
        sessionStorage.removeItem('deepblue_uid');
        setSessionRestored(true);
        return;
      }

      const savedSession = sessionStorage.getItem('deepblue_session');
      const savedRole = sessionStorage.getItem('deepblue_role');
      const savedToken = sessionStorage.getItem('deepblue_token');

      if (savedToken) {
        try {
          // Validar token contra el backend
          const meRes = await fetch(`${API_BASE_URL}/api/session/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          const me = await meRes.json().catch(() => ({}));
          if (meRes.ok && me.success && me.user_id) {
            // Validar UID de pestaña y vincularlo al token
            const savedUid = sessionStorage.getItem('deepblue_uid');
            if (savedUid && savedUid !== me.user_id) {
              sessionStorage.removeItem('deepblue_session');
              sessionStorage.removeItem('deepblue_role');
              sessionStorage.removeItem('deepblue_token');
              sessionStorage.setItem('deepblue_uid', me.user_id);
            } else if (!savedUid) {
              sessionStorage.setItem('deepblue_uid', me.user_id);
            }
            // Token válido: cargar datos del usuario por su id
            const userRes = await fetch(`${API_BASE_URL}/api/arrecife/${me.user_id}`);
            const userJson = await userRes.json().catch(() => ({}));
            if (userRes.ok && userJson.success && userJson.data) {
              const u = userJson.data;
              setUserData({
                id: u.user_id,
                nombre: u.username || u.email || 'Usuario',
                nivel: typeof u.nivel === 'number' ? u.nivel : 1,
                gotas: typeof u.gotas_agua === 'number' ? u.gotas_agua : 0,
                perlas: typeof u.perlas === 'number' ? u.perlas : 0,
                arrecife_items: Array.isArray(u.arrecife_items) ? u.arrecife_items : [],
                fondos: Array.isArray(u.fondos) ? u.fondos : [],
              });
              setUserRole(me.role || savedRole || 'player');
            } else {
              // No se pudo cargar el usuario
              sessionStorage.removeItem('deepblue_session');
              sessionStorage.removeItem('deepblue_role');
              sessionStorage.removeItem('deepblue_token');
              sessionStorage.removeItem('deepblue_uid');
            }
          } else {
            // Token inválido
            sessionStorage.removeItem('deepblue_session');
            sessionStorage.removeItem('deepblue_role');
            sessionStorage.removeItem('deepblue_token');
            sessionStorage.removeItem('deepblue_uid');
          }
        } catch (error) {
          console.log('Error restaurando sesión:', error);
          sessionStorage.removeItem('deepblue_session');
          sessionStorage.removeItem('deepblue_role');
          sessionStorage.removeItem('deepblue_token');
          sessionStorage.removeItem('deepblue_uid');
        }
      }

      setSessionRestored(true);
    };

    restoreSession();
  }, []);

  // Persistir sesión en sessionStorage cuando cambia userData
  useEffect(() => {
    if (sessionRestored) {
      if (userData) {
        sessionStorage.setItem('deepblue_session', JSON.stringify(userData));
      } else {
        sessionStorage.removeItem('deepblue_session');
      }
    }
  }, [userData, sessionRestored]);

  // Persistir rol en sessionStorage cuando cambia userRole
  useEffect(() => {
    if (sessionRestored) {
      if (userRole) {
        sessionStorage.setItem('deepblue_role', userRole);
      } else {
        sessionStorage.removeItem('deepblue_role');
      }
    }
  }, [userRole, sessionRestored]);

  // Cargar datos del backend al iniciar
  useEffect(() => {
    const loadInitialData = async () => {
      if (dataLoaded) return;
      
      try {
        // Cargar usuarios
        const usersRes = await fetch(`${API_BASE_URL}/api/admin/users`);
        const usersJson = await usersRes.json().catch(() => ({}));
        if (usersRes.ok && usersJson.success && Array.isArray(usersJson.data)) {
          setUsers(usersJson.data);
        }

        // Cargar solicitudes
        const reqRes = await fetch(`${API_BASE_URL}/api/recharges`);
        const reqJson = await reqRes.json().catch(() => ({}));
        if (reqRes.ok && reqJson.success && Array.isArray(reqJson.data)) {
          setRechargeRequests(reqJson.data.map(r => ({
            ...r,
            user: r.username || r.userId, // Agregar campo 'user' para compatibilidad
            filePreview: r.fileUrl ? `${API_BASE_URL}${r.fileUrl}` : null,
          })));
        }

        // Cargar retiros
        try {
          const wdRes = await fetch(`${API_BASE_URL}/api/withdrawals`);
          const wdJson = await wdRes.json().catch(() => ({}));
          if (wdRes.ok && wdJson.success && Array.isArray(wdJson.data)) {
            setWithdrawals(wdJson.data);
          }
        } catch {}

        setDataLoaded(true);
      } catch (error) {
        console.log('No se pudo cargar datos del backend:', error.message);
        setDataLoaded(true);
      }
    };

    loadInitialData();
  }, [dataLoaded]);

  // Recargar datos del usuario actual periódicamente
  useEffect(() => {
    if (!userData?.id) return;

    const reloadUserData = async () => {
      try {
        const userRes = await fetch(`${API_BASE_URL}/api/arrecife/${userData.id}`);
        const userJson = await userRes.json().catch(() => ({}));
        if (userRes.ok && userJson.success && userJson.data) {
          const u = userJson.data;
          // Si el backend responde con un id distinto, invalidar sesión por seguridad
          if (u.user_id && u.user_id !== userData.id) {
            sessionStorage.removeItem('deepblue_session');
            sessionStorage.removeItem('deepblue_role');
            sessionStorage.removeItem('deepblue_token');
            setUserData(null);
            setUserRole(null);
            return;
          }
          setUserData(prev => ({
            ...prev,
            gotas: u.gotas_agua || 0,
            perlas: u.perlas || 0,
            nivel: u.nivel || 1,
            arrecife_items: u.arrecife_items || [],
            fondos: u.fondos || []
          }));
        }
      } catch (error) {
        console.log('Error recargando datos del usuario:', error.message);
      }
    };

    // Recargar cada 3 segundos
    const interval = setInterval(reloadUserData, 3000);
    return () => clearInterval(interval);
  }, [userData?.id]);

  // Registro: intenta API
  const handleRegister = async (nombre, apellido, username, password, securityPassword, referralCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre, 
          apellido, 
          username, 
          password,
          referredBy: referralCode || null
        }),
      });
      const result = await response.json().catch(() => ({}));
      
      if (!response.ok || !result.success) {
        return { success: false, message: result.message || 'Error en el registro' };
      }

      // Recargar lista de usuarios
      setDataLoaded(false);

      return { success: true };
    } catch (error) {
      return { success: false, message: 'No se pudo conectar con el servidor. Intenta más tarde.' };
    }
  };

  // Login: intenta API y mapea la respuesta al shape usado por los componentes
  const handleLogin = async (username, password) => {
    try {
      // 1) Login → devuelve user_id, token y role
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const login = await response.json().catch(() => ({}));
      if (!response.ok || !login.success || !login.user_id || !login.token) {
        throw new Error(login.message || 'Error de autenticación');
      }

      // Guardar token, rol y uid para restauración segura
      sessionStorage.setItem('deepblue_token', login.token);
      sessionStorage.setItem('deepblue_role', login.role || 'player');
      sessionStorage.setItem('deepblue_uid', login.user_id);

      // 2) Obtener datos del usuario (arrecife) con user_id
      const userRes = await fetch(`${API_BASE_URL}/api/arrecife/${login.user_id}`);
      const userJson = await userRes.json().catch(() => ({}));
      if (!userRes.ok || !userJson.success || !userJson.data) {
        throw new Error(userJson.message || 'No se pudo cargar el usuario');
      }

      const u = userJson.data;
      const role = login.role || 'player';
      const nextUser = {
        id: login.user_id,
        nombre: u.username || username,
        nivel: typeof u.nivel === 'number' ? u.nivel : 1,
        gotas: typeof u.gotas_agua === 'number' ? u.gotas_agua : 0,
        perlas: typeof u.perlas === 'number' ? u.perlas : 0,
        arrecife_items: Array.isArray(u.arrecife_items) ? u.arrecife_items : [],
        fondos: Array.isArray(u.fondos) ? u.fondos : [],
      };

      setUserData(nextUser);
      setUserRole(role);

      // Recargar datos del backend
      setDataLoaded(false);

      return { success: true };
    } catch (error) {
      console.error('Error de autenticación:', error.message);
      return { success: false, message: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.' };
    }
  };

  // Acción de explorar: ahora abre el flujo de recarga de gotas
  const handleExplore = () => {
    // Abrimos el modal de recarga directamente
    setRecargaItem({ id: 'gotas', name: 'Recargar Gotas' });
    setMostrarMercado(false);
    setMostrarRecarga(true);
  };

  // Abrir/cerrar mercado
  const handleOpenMarket = () => setMostrarMercado(true);
  const handleCloseMarket = () => setMostrarMercado(false);
  const handleOpenWithdraw = () => setMostrarRetiro(true);
  const handleCloseWithdraw = () => setMostrarRetiro(false);
  const handleOpenFondo = () => setMostrarFondo(true);
  const handleCloseFondo = () => setMostrarFondo(false);

  // Comprar Fondo Marino
  const handleBuyFund = async (amount) => {
    if (!userData?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/funds/buy`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id, amount })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || 'No se pudo comprar el fondo');
      setUserData(prev => ({ ...prev, gotas: json.data.gotas_agua || 0, fondos: json.data.fondos || [] }));
      alert('✅ Fondo comprado.');
    } catch (e) {
      alert(`❌ Error: ${e.message}`);
    }
  };

  // Comprar ítem por id usando marketItems centralizado
  const handleBuy = async (itemId) => {
    if (!userData) return;
    const item = marketItems.find(i => i.id === itemId);
    if (!item) return;

    const gotasActuales = userData.gotas ?? 0;
    if (gotasActuales < item.cost) {
      // Abrimos flujo de recarga
      setMostrarMercado(false);
      setRecargaItem(item);
      setMostrarRecarga(true);
      return;
    }

    // Calcular nuevas gotas (restar el costo)
    const newGotas = gotasActuales - item.cost;

    const newItem = {
      id: `${itemId}-${Date.now()}`,
      tipo: itemId,
      nombre: item.name,
      image: item.image,
      pos_x: Math.random() * 60 + 20,
      pos_y: Math.random() * 40 + 10,
    };

    const updates = { 
      gotas: newGotas,
      arrecife_items: [...(userData.arrecife_items || []), newItem]
    };
    
    if (itemId === 'coral') updates.perlas = (userData.perlas ?? 0) + 1;
    if (itemId === 'alga') updates.nivel = (userData.nivel ?? 0) + 0.5;

    // Actualizar en el backend
    try {
      const response = await fetch(`${API_BASE_URL}/api/arrecife/${userData.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gotas_agua: newGotas,
          perlas: updates.perlas,
          nivel: updates.nivel,
          arrecife_items: updates.arrecife_items
        }),
      });
      
      if (response.ok) {
        setUserData(prev => ({ ...prev, ...updates }));
        setMostrarMercado(false);
        alert(`¡Has comprado ${item.name}! Ahora lo verás en tu arrecife.`);
      } else {
        alert('Error al procesar la compra. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al actualizar compra:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

  // Al faltar Gotas desde Mercado
  const handleNeedRecharge = (item) => {
    setMostrarMercado(false);
    setRecargaItem(item);
    setMostrarRecarga(true);
  };

  // Envío de recarga
  const handleSubmitRecharge = async (payload) => {
    if (!userData?.id) {
      alert('Error: No se pudo identificar el usuario. Por favor, vuelve a iniciar sesión.');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('userId', userData.id);
      fd.append('network', payload.network || '');
      fd.append('address', payload.address || '');
      fd.append('amount', `${payload.amount || ''}`);
      fd.append('note', payload.note || '');
      if (recargaItem?.id) fd.append('item', recargaItem.id);
      if (payload.file) fd.append('file', payload.file);

      const res = await fetch(`${API_BASE_URL}/api/recharges`, { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || 'No se pudo crear la solicitud');

      // Actualiza lista local rápidamente
      // Recargar solicitudes
      setDataLoaded(false);

      alert('✅ Solicitud enviada. Un administrador revisará tu comprobante.');
      setMostrarRecarga(false);
      setRecargaItem(null);
    } catch (e) {
      alert('❌ Error al enviar la solicitud. Verifica que el backend esté corriendo.');
      setMostrarRecarga(false);
      setRecargaItem(null);
    }
  };

  const handleApproveRecharge = async (requestId, creditAmount) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/recharges/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditAmount }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || 'No se pudo aprobar la solicitud');

      // Actualiza estado local
      setRechargeRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));

      const updatedUser = json.updatedUser;
      if (updatedUser) {
        // Sync lista de usuarios
        setUsers(prev => prev.map(u => u.nombre === updatedUser.username ? { ...u, gotas: updatedUser.gotas_agua || 0 } : u));
        // Sync usuario logueado
        setUserData(prev => (prev && prev.nombre === updatedUser.username) ? { ...prev, gotas: updatedUser.gotas_agua || 0 } : prev);
      }
      
      // Recargar datos
      setDataLoaded(false);
      
      alert(`✅ Solicitud #${requestId} aprobada y ${creditAmount} gotas acreditadas.`);
    } catch (e) {
      alert(`❌ Error al aprobar: ${e.message}`);
    }
  };

  const handleDenyRecharge = async (requestId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/recharges/${requestId}/deny`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || 'No se pudo denegar la solicitud');

      // Actualiza estado local
      setRechargeRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'denied' } : r));
      
      // Recargar datos
      setDataLoaded(false);
      
      alert(`✅ Solicitud #${requestId} denegada.`);
    } catch (e) {
      alert(`❌ Error al denegar: ${e.message}`);
    }
  };

  // Envío de retiro
  const handleSubmitWithdraw = async ({ network, address, amount, note }) => {
    if (!userData?.id) return alert('Sesión expirada, inicia sesión.');
    try {
      const res = await fetch(`${API_BASE_URL}/api/withdrawals`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id, network, address, amount, note })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || 'No se pudo crear el retiro');
      alert('✅ Solicitud de retiro enviada');
      setMostrarRetiro(false);
      // Forzar recarga de retiros como con recargas
      setDataLoaded(false);
    } catch (e) {
      alert(`❌ Error en retiro: ${e.message}`);
    }
  };

  const handleLogout = () => {
    setUserData(null);
    setUserRole(null);
    setMostrarMercado(false);
    setMostrarRecarga(false);
    setRecargaItem(null);
    // Limpiar sessionStorage
    sessionStorage.removeItem('deepblue_session');
    sessionStorage.removeItem('deepblue_role');
    sessionStorage.removeItem('deepblue_token');
    sessionStorage.removeItem('deepblue_uid');
  };

  // Mostrar loading mientras se restaura la sesión
  if (!sessionRestored) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'radial-gradient(60% 40% at 50% 10%, #0a6abf 0%, #003b66 60%, #001a33 100%)',
        color: '#7dd3fc',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Cargando DeepBlue...
      </div>
    );
  }

  return (
    <div className="App">
      {!userData ? (
        <Login onLogin={handleLogin} onRegister={handleRegister} />
      ) : userRole === 'admin' ? (
        <AdminDashboard
          onLogout={handleLogout}
          users={users}
          requests={rechargeRequests}
          onApproveRequest={handleApproveRecharge}
          onDenyRequest={handleDenyRecharge}
        />
      ) : (
        <>
          <Arrecife
            userData={userData}
            onExplore={handleExplore}
            onOpenMarket={handleOpenMarket}
            onOpenFondo={handleOpenFondo}
            onOpenWithdraw={handleOpenWithdraw}
            onLogout={handleLogout}
            requests={rechargeRequests}
            withdrawals={withdrawals}
          />
          {mostrarMercado && (
            <Mercado
              userData={userData}
              onClose={handleCloseMarket}
              onBuy={handleBuy}
              onNeedRecharge={handleNeedRecharge}
            />
          )}

          {mostrarFondo && (
            <FondoMarinoModal onClose={handleCloseFondo} onBuy={handleBuyFund} userData={userData} />
          )}

          {mostrarRetiro && (
            <RetiroModal onClose={handleCloseWithdraw} onSubmit={handleSubmitWithdraw} />
          )}

          {mostrarRecarga && (
            <RecargaModal
              onClose={() => { setMostrarRecarga(false); setRecargaItem(null); }}
              onSubmit={handleSubmitRecharge}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;

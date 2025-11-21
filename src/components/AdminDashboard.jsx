import React, { useEffect, useState } from 'react';

// AdminDashboard conectado a App: recibe usuarios, solicitudes y callbacks
// Props:
// - onLogout: () => void
// - users: Array<{ id, nombre, email, nivel, rol, ultimo_acceso, gotas }>
// - requests: Array<{ id, user, item, network, address, amount, note, filePreview, status, created_at }>
// - onApproveRequest: (requestId: string, creditAmount: number) => void
// - onDenyRequest: (requestId: string) => void

const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:3000';

const AdminDashboard = ({ onLogout, users = [], requests = [], onApproveRequest, onDenyRequest }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [creditAmounts, setCreditAmounts] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [referralsData, setReferralsData] = useState(null);
  const [manualCreditUserId, setManualCreditUserId] = useState('');
  const [manualCreditAmount, setManualCreditAmount] = useState('');
  const [creditType, setCreditType] = useState('gotas');
  const [purchasesUserId, setPurchasesUserId] = useState('');
  const [purchases, setPurchases] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [fundsUserId, setFundsUserId] = useState('');
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    // Si cambiamos a la pestaña de referidos y hay un usuario seleccionado, cargar
    if (activeTab === 'referrals' && selectedUser) {
      (async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/referrals/${selectedUser.id}`);
          const json = await res.json().catch(() => ({}));
          if (res.ok && json.success) {
            setReferralsData(json.data);
          } else {
            setReferralsData({ totalReferrals: 0, totalEarned: 0, referrals: [] });
          }
        } catch {
          setReferralsData({ totalReferrals: 0, totalEarned: 0, referrals: [] });
        }
      })();
    }

    // Si cambiamos a compras y hay usuario seleccionado, cargar su arrecife
    if (activeTab === 'purchases' && purchasesUserId) {
      (async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/arrecife/${purchasesUserId}`);
          const json = await res.json().catch(() => ({}));
          if (res.ok && json.success && json.data) {
            setPurchases(json.data.arrecife_items || []);
          } else {
            setPurchases([]);
          }
        } catch {
          setPurchases([]);
        }
      })();
    }

    // Si cambiamos a retiros, cargar listado
    if (activeTab === 'withdrawals') {
      (async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/withdrawals`);
          const json = await res.json().catch(() => ({}));
          if (res.ok && json.success && Array.isArray(json.data)) setWithdrawals(json.data);
          else setWithdrawals([]);
        } catch {
          setWithdrawals([]);
        }
      })();
    }

    // Si cambiamos a fondos y hay usuario, cargar fondos del usuario
    if (activeTab === 'funds' && fundsUserId) {
      (async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/arrecife/${fundsUserId}`);
          const json = await res.json().catch(() => ({}));
          if (res.ok && json.success && json.data) setFunds(json.data.fondos || []);
          else setFunds([]);
        } catch {
          setFunds([]);
        }
      })();
    }
  }, [activeTab, selectedUser, purchasesUserId, fundsUserId]);

  const handleChangeAmount = (id, value) => {
    setCreditAmounts(prev => ({ ...prev, [id]: value }));
  };

  const handleApprove = (req) => {
    const amount = parseFloat(creditAmounts[req.id] ?? req.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Ingresa un monto válido para acreditar.');
      return;
    }
    if (window.confirm(`¿Aprobar solicitud #${req.id} y acreditar ${amount} gotas a ${req.user}?`)) {
      onApproveRequest?.(req.id, amount);
    }
  };

  const handleDeny = (req) => {
    if (window.confirm(`¿Denegar solicitud #${req.id} de ${req.user}?`)) {
      onDenyRequest?.(req.id);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fbbf24', color: '#78350f', text: 'Pendiente' },
      approved: { bg: '#10b981', color: '#064e3b', text: 'Aceptado' },
      denied: { bg: '#ef4444', color: '#7f1d1d', text: 'Denegado' }
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{
        background: style.bg,
        color: style.color,
        padding: '4px 12px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        {style.text}
      </span>
    );
  };

  const renderUsersTable = () => (
    <div className="table-responsive">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Nivel</th>
            <th>Gotas</th>
            <th>Rol</th>
            <th>Último Acceso</th>
            <th>Ref.</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', padding: 20 }}>Sin usuarios registrados.</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.apellido || '-'}</td>
                <td>{user.email}</td>
                <td>{user.nivel}</td>
                <td>{user.gotas ?? 0}</td>
                <td>{user.rol}</td>
                <td>{user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : '-'}</td>
                <td>
                  <button className="btn-view" onClick={() => { setSelectedUser(user); setActiveTab('referrals'); }}>
                    Ver
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderRequests = () => {
    const pendingRequests = requests.filter(r => r.status === 'pending');
    const processedRequests = requests.filter(r => r.status !== 'pending').sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    return (
      <div className="request-panel">
        <h3 style={{ marginBottom: 20 }}>📨 Registro de Solicitudes</h3>
        
        {/* Solicitudes Pendientes */}
        <div style={{ marginBottom: 30 }}>
          <h4 style={{ color: '#fbbf24', marginBottom: 12 }}>⏳ Pendientes ({pendingRequests.length})</h4>
          {pendingRequests.length === 0 ? (
            <p className="text-muted">No hay solicitudes pendientes.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pendingRequests.map(req => (
                <div key={req.id} style={{ 
                  background: '#172534', 
                  borderRadius: 8, 
                  padding: 16, 
                  border: '2px solid #fbbf24',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.1)'
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Solicitud #{req.id}</div>
                      <div className="text-muted" style={{ fontSize: 13 }}>📅 {new Date(req.created_at).toLocaleString()}</div>
                      <div style={{ marginTop: 8 }}>{getStatusBadge(req.status)}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 240 }}>
                      <span><strong>👤 Usuario:</strong> {req.user}</span>
                      <span><strong>🌐 Red:</strong> {req.network}</span>
                      {req.item && <span><strong>🎁 Item:</strong> {req.item}</span>}
                      <span><strong>💰 Monto:</strong> {req.amount} gotas</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <span className="text-muted" style={{ fontSize: 12 }}>📍 Dirección de wallet:</span>
                      <div style={{ 
                        overflowX: 'auto', 
                        background: '#0f1419', 
                        padding: 8, 
                        borderRadius: 4, 
                        fontSize: 12,
                        fontFamily: 'monospace',
                        marginTop: 4
                      }}>{req.address}</div>
                      {req.note && (
                        <>
                          <span className="text-muted" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>📝 Nota:</span>
                          <div style={{ fontSize: 13, marginTop: 4 }}>{req.note}</div>
                        </>
                      )}
                    </div>
                    {req.filePreview && (
                      <div>
                        <span className="text-muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>📎 Comprobante:</span>
                        <img src={req.filePreview} alt="Comprobante" style={{ 
                          maxWidth: 220, 
                          maxHeight: 160, 
                          objectFit: 'cover', 
                          borderRadius: 6,
                          border: '1px solid #374151'
                        }} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #233244' }}>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Gotas a acreditar"
                      value={creditAmounts[req.id] ?? req.amount}
                      onChange={(e) => handleChangeAmount(req.id, e.target.value)}
                      style={{ 
                        padding: '8px 12px', 
                        borderRadius: 6, 
                        border: '1px solid #374151', 
                        background: '#111827', 
                        color: '#e5e7eb',
                        flex: 1,
                        maxWidth: 200
                      }}
                    />
                    <button 
                      className="btn-view" 
                      onClick={() => handleApprove(req)}
                      style={{ 
                        background: '#10b981', 
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      ✓ Aprobar
                    </button>
                    <button 
                      onClick={() => handleDeny(req)}
                      style={{ 
                        background: '#ef4444', 
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      ✗ Denegar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Solicitudes Procesadas */}
        <div>
          <h4 style={{ color: '#94a3b8', marginBottom: 12 }}>📋 Historial ({processedRequests.length})</h4>
          {processedRequests.length === 0 ? (
            <p className="text-muted">No hay solicitudes procesadas.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {processedRequests.map(req => (
                <div key={req.id} style={{ 
                  background: '#0f1419', 
                  borderRadius: 8, 
                  padding: 12, 
                  border: '1px solid #233244',
                  opacity: 0.85
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        Solicitud #{req.id} - {req.user}
                      </div>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        {new Date(req.created_at).toLocaleString()} | {req.network} | {req.amount} gotas
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(req.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReferrals = () => (
    <div className="request-panel">
      <h3 style={{ marginBottom: 12 }}>👥 Referidos {selectedUser ? `de ${selectedUser.nombre}` : ''}</h3>
      {!selectedUser ? (
        <p className="text-muted">Selecciona un usuario en la pestaña Usuarios para ver sus referidos.</p>
      ) : !referralsData ? (
        <p className="text-muted">Cargando referidos...</p>
      ) : (
        <>
          <div style={{ marginBottom: 16, color: '#9dd6ff' }}>
            Total referidos: <strong>{referralsData.totalReferrals}</strong> · Ganancia total por referidos: <strong>{referralsData.totalEarned}</strong> gotas
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Nombre</th>
                  <th>Ganaste</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {referralsData.referrals.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>Sin referidos.</td></tr>
                ) : referralsData.referrals.map(r => (
                  <tr key={r.user_id}>
                    <td>{r.user_id}</td>
                    <td>{r.username}</td>
                    <td>{r.email}</td>
                    <td>{r.name}</td>
                    <td>{r.earned}</td>
                    <td>{new Date(r.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  const renderCredits = () => {
    const sendCredit = async () => {
      const amt = parseFloat(manualCreditAmount || '0');
      if (!manualCreditUserId || !amt || amt <= 0) {
        alert('Selecciona un usuario y un monto válido (>0).');
        return;
      }
      const endpoint = creditType === 'perlas' ? `${API_BASE_URL}/api/admin/credit-pearls` : `${API_BASE_URL}/api/admin/credit`;
      if (!window.confirm(`¿Acreditar ${amt} ${creditType} a ${manualCreditUserId}?`)) return;
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: manualCreditUserId, amount: amt }) });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.message || 'No se pudo acreditar');
        alert(`✅ ${creditType === 'perlas' ? 'Perlas' : 'Gotas'} acreditadas`);
      } catch (e) { alert(`❌ Error: ${e.message}`); }
    };

    return (
      <div className="request-panel">
        <div style={{
          background: '#0f1419', border: '1px solid #233244', borderRadius: 10, padding: 16,
          boxShadow: '0 6px 18px rgba(0,0,0,0.25)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Créditos</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={manualCreditUserId}
              onChange={(e) => setManualCreditUserId(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #374151' }}
            >
              <option value="">Selecciona usuario...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
              ))}
            </select>
            <select value={creditType} onChange={(e) => setCreditType(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #374151' }}>
              <option value="gotas">Gotas</option>
              <option value="perlas">Perlas</option>
            </select>
            <input
              type="number"
              min="0"
              step="any"
              placeholder={`Cantidad de ${creditType}`}
              value={manualCreditAmount}
              onChange={(e) => setManualCreditAmount(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, width: 200, background: '#111827', color: '#e5e7eb', border: '1px solid #374151' }}
            />
            <button className="btn-view" onClick={sendCredit}>Enviar</button>
          </div>
          <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>
            Consejo: verifica identidad del usuario antes de acreditar. Esta acción se registra en el historial.
          </div>
        </div>
      </div>
    );
  };

  const renderPurchases = () => (
    <div className="request-panel">
      <h3 style={{ marginBottom: 12 }}>🛒 Compras por Usuario</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <select value={purchasesUserId} onChange={(e) => setPurchasesUserId(e.target.value)} style={{ padding: '8px 10px', borderRadius: 6 }}>
          <option value="">Selecciona usuario...</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
          ))}
        </select>
      </div>
      {!purchasesUserId ? (
        <p className="text-muted">Selecciona un usuario para ver sus compras.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Item</th>
                <th>Tipo</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 20 }}>Sin compras.</td></tr>
              ) : purchases.map(it => {
                const ts = it.id && it.id.includes('-') ? parseInt(it.id.split('-')[1]) : Date.now();
                const d = new Date(ts);
                return (
                  <tr key={it.id}>
                    <td>{it.image ? <img src={it.image} alt={it.nombre} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} /> : '—'}</td>
                    <td>{it.nombre}</td>
                    <td>{it.tipo}</td>
                    <td>{d.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderWithdrawals = () => {
    const pending = withdrawals.filter(w => w.status === 'pending');
    const processed = withdrawals.filter(w => w.status !== 'pending').sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    const reloadWithdrawals = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/withdrawals`);
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.success && Array.isArray(json.data)) setWithdrawals(json.data);
      } catch {}
    };

    const ApproveBtn = ({ row }) => (
      <button
        className="btn-view"
        onClick={async () => {
          if (!window.confirm(`Aprobar retiro #${row.id} de ${row.username} por ${row.amount} USDT?`)) return;
          try {
            const res = await fetch(`${API_BASE_URL}/api/withdrawals/${row.id}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || !json.success) throw new Error(json.message || 'No se pudo aprobar');
            await reloadWithdrawals();
          } catch (e) { alert(`Error: ${e.message}`); }
        }}
        style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6 }}
      >Aprobar</button>
    );

    const DenyBtn = ({ row }) => (
      <button
        onClick={async () => {
          if (!window.confirm(`Denegar retiro #${row.id} de ${row.username}?`)) return;
          try {
            const res = await fetch(`${API_BASE_URL}/api/withdrawals/${row.id}/deny`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || !json.success) throw new Error(json.message || 'No se pudo denegar');
            await reloadWithdrawals();
          } catch (e) { alert(`Error: ${e.message}`); }
        }}
        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6 }}
      >Denegar</button>
    );

    return (
      <div className="request-panel">
        <h3 style={{ marginBottom: 12 }}>💸 Retiros</h3>

        <h4 style={{ color: '#fbbf24', margin: '8px 0' }}>Pendientes ({pending.length})</h4>
        {pending.length === 0 ? <p className="text-muted">No hay retiros pendientes.</p> : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Red</th>
                  <th>Dirección</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.username}</td>
                    <td>{r.network}</td>
                    <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.address}</td>
                    <td>{r.amount}</td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <ApproveBtn row={r} />
                      <DenyBtn row={r} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h4 style={{ color: '#94a3b8', margin: '16px 0 8px' }}>Historial ({processed.length})</h4>
        {processed.length === 0 ? <p className="text-muted">No hay retiros procesados.</p> : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Red</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {processed.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.username}</td>
                    <td>{r.network}</td>
                    <td>{r.amount}</td>
                    <td>{r.status}</td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderFunds = () => (
    <div className="request-panel">
      <h3 style={{ marginBottom: 12 }}>🌊 Fondos por Usuario</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <select value={fundsUserId} onChange={(e) => setFundsUserId(e.target.value)} style={{ padding: '8px 10px', borderRadius: 6 }}>
          <option value="">Selecciona usuario...</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
          ))}
        </select>
      </div>
      {!fundsUserId ? (
        <p className="text-muted">Selecciona un usuario para ver sus fondos.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Monto</th>
                <th>Duración</th>
                <th>Tasa diaria</th>
                <th>Generará (45 días)</th>
                <th>Inicio</th>
                <th>Fin</th>
              </tr>
            </thead>
            <tbody>
              {funds.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>Sin fondos comprados.</td></tr>
              ) : funds.map(f => (
                <tr key={f.id}>
                  <td>{f.amount}</td>
                  <td>{f.days} días</td>
                  <td>{f.daily_rate}%</td>
                  <td>{(f.expected_total).toFixed(2)} 💧</td>
                  <td>{new Date(f.start_date).toLocaleString()}</td>
                  <td>{new Date(f.end_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'users') return renderUsersTable();
    if (activeTab === 'requests') return renderRequests();
    if (activeTab === 'referrals') return renderReferrals();
    if (activeTab === 'credits') return renderCredits();
    if (activeTab === 'purchases') return renderPurchases();
    if (activeTab === 'withdrawals') return renderWithdrawals();
    if (activeTab === 'funds') return renderFunds();
    return <p>⚙️ Configuración de la plataforma.</p>;
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>DeepBlue Admin Console</h2>
        <div className="admin-controls">
          <p>Bienvenido, Administrador</p>
          <button className="btn-logout" onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </header>

      <nav className="admin-nav">
        <button className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          👤 Usuarios ({users.length})
        </button>
        <button className={`nav-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
          📨 Solicitudes ({requests.length})
        </button>
        <button className={`nav-btn ${activeTab === 'referrals' ? 'active' : ''}`} onClick={() => setActiveTab('referrals')}>
          👥 Referidos
        </button>
        <button className={`nav-btn ${activeTab === 'purchases' ? 'active' : ''}`} onClick={() => setActiveTab('purchases')}>
          🛒 Compras
        </button>
        <button className={`nav-btn ${activeTab === 'withdrawals' ? 'active' : ''}`} onClick={() => setActiveTab('withdrawals')}>
          💸 Retiros
        </button>
        <button className={`nav-btn ${activeTab === 'funds' ? 'active' : ''}`} onClick={() => setActiveTab('funds')}>
          🌊 Fondos
        </button>
        <button className={`nav-btn ${activeTab === 'credits' ? 'active' : ''}`} onClick={() => setActiveTab('credits')}>
          💧 Créditos
        </button>
        <button className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          ⚙️ Configuración
        </button>
      </nav>

      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;

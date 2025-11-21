import React from 'react';

const styles = `
.mr-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; backdrop-filter: blur(4px); }
.mr-modal { background: linear-gradient(135deg, #0a2540 0%, #001a33 100%); border: 1px solid rgba(0,170,255,0.3); border-radius: 16px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
.mr-header { padding: 24px; border-bottom: 1px solid rgba(0,170,255,0.2); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: linear-gradient(135deg, #0a2540 0%, #001a33 100%); z-index: 1; }
.mr-title { font-size: 22px; font-weight: 700; color: #7dd3fc; margin: 0; }
.mr-close { background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; }
.mr-content { padding: 24px; }
.mr-empty { text-align: center; padding: 60px 20px; color: #94a3b8; }
.mr-table { width: 100%; border-collapse: separate; border-spacing: 0; }
.mr-table th { text-align: left; padding: 12px; font-size: 13px; color: #9acfff; border-bottom: 1px solid rgba(0,170,255,0.2); position: sticky; top: 0; background: #0b2036; }
.mr-table td { padding: 12px; font-size: 14px; color: #d1eaff; border-bottom: 1px solid rgba(0,170,255,0.08); }
.mr-badge { padding: 6px 10px; border-radius: 14px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
.mr-pending { background: #fbbf24; color: #78350f; }
.mr-approved { background: #10b981; color: #064e3b; }
.mr-denied { background: #ef4444; color: #7f1d1d; }
`;

const MisRetiros = ({ onClose, withdrawals = [], userId }) => {
  const mine = (withdrawals || []).filter(w => w.userId === userId).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  const badge = (s) => s === 'approved' ? 'mr-approved' : s === 'denied' ? 'mr-denied' : 'mr-pending';

  return (
    <div className="mr-overlay" onClick={onClose}>
      <style>{styles}</style>
      <div className="mr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mr-header">
          <h3 className="mr-title">💵 Mis Retiros</h3>
          <button className="mr-close" onClick={onClose}>✕ Cerrar</button>
        </div>
        <div className="mr-content">
          {mine.length === 0 ? (
            <div className="mr-empty">No tienes retiros registrados.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="mr-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Red</th>
                    <th>Dirección</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {mine.map(r => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.network}</td>
                      <td style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.address}</td>
                      <td>{r.amount}</td>
                      <td><span className={`mr-badge ${badge(r.status)}`}>{r.status}</span></td>
                      <td>{new Date(r.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisRetiros;

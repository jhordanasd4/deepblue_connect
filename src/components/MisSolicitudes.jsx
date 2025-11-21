import React from 'react';

const misSolicitudesStyles = `
.mis-solicitudes-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.mis-solicitudes-modal {
  background: linear-gradient(135deg, #0a2540 0%, #001a33 100%);
  border: 1px solid rgba(0, 170, 255, 0.3);
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.mis-solicitudes-header {
  padding: 24px;
  border-bottom: 1px solid rgba(0, 170, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #0a2540 0%, #001a33 100%);
  z-index: 1;
}

.mis-solicitudes-title {
  font-size: 24px;
  font-weight: 700;
  color: #7dd3fc;
  margin: 0;
}

.mis-solicitudes-close {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #fca5a5;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.mis-solicitudes-close:hover {
  background: rgba(239, 68, 68, 0.3);
}

.mis-solicitudes-content {
  padding: 24px;
}

.solicitud-card {
  background: rgba(0, 30, 55, 0.6);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid rgba(0, 170, 255, 0.2);
}

.solicitud-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.solicitud-id {
  font-size: 18px;
  font-weight: 700;
  color: #bfe9ff;
}

.solicitud-date {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
}

.solicitud-status {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: #fbbf24;
  color: #78350f;
}

.status-approved {
  background: #10b981;
  color: #064e3b;
}

.status-denied {
  background: #ef4444;
  color: #7f1d1d;
}

.solicitud-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.solicitud-detail {
  font-size: 14px;
  color: #d1eaff;
}

.solicitud-detail strong {
  color: #7dd3fc;
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
}

.solicitud-address {
  background: rgba(0, 15, 30, 0.8);
  padding: 10px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
  color: #9cd9ff;
  word-break: break-all;
  margin-top: 8px;
}

.solicitud-image {
  margin-top: 12px;
  text-align: center;
}

.solicitud-image img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid rgba(0, 170, 255, 0.3);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-state-subtext {
  font-size: 14px;
  opacity: 0.8;
}
`;

const MisSolicitudes = ({ onClose, requests = [], userName, userId }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'denied': return 'status-denied';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return '✓ Aceptado';
      case 'denied': return '✗ Denegado';
      default: return '⏳ Pendiente';
    }
  };

  // Filtrar solicitudes del usuario actual estrictamente por userId
  const userRequests = requests.filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="mis-solicitudes-overlay" onClick={onClose}>
      <style>{misSolicitudesStyles}</style>
      <div className="mis-solicitudes-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mis-solicitudes-header">
          <h2 className="mis-solicitudes-title">📋 Mis Solicitudes</h2>
          <button className="mis-solicitudes-close" onClick={onClose}>
            ✕ Cerrar
          </button>
        </div>

        <div className="mis-solicitudes-content">
          {userRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">No tienes solicitudes</div>
              <div className="empty-state-subtext">
                Cuando realices una solicitud de recarga, aparecerá aquí
              </div>
            </div>
          ) : (
            userRequests.map(req => (
              <div key={req.id} className="solicitud-card">
                <div className="solicitud-card-header">
                  <div>
                    <div className="solicitud-id">Solicitud #{req.id}</div>
                    <div className="solicitud-date">
                      📅 {new Date(req.created_at).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <span className={`solicitud-status ${getStatusClass(req.status)}`}>
                    {getStatusText(req.status)}
                  </span>
                </div>

                <div className="solicitud-details">
                  <div className="solicitud-detail">
                    <strong>🌐 Red</strong>
                    {req.network}
                  </div>
                  <div className="solicitud-detail">
                    <strong>💰 Monto</strong>
                    {req.amount} gotas
                  </div>
                  {req.item && (
                    <div className="solicitud-detail">
                      <strong>🎁 Item solicitado</strong>
                      {req.item}
                    </div>
                  )}
                </div>

                {req.note && (
                  <div className="solicitud-detail" style={{ marginTop: 12 }}>
                    <strong>📝 Nota</strong>
                    {req.note}
                  </div>
                )}

                {req.filePreview && (
                  <div className="solicitud-image">
                    <strong style={{ display: 'block', marginBottom: 8, color: '#7dd3fc', fontSize: 12 }}>
                      📎 Comprobante adjunto
                    </strong>
                    <img src={req.filePreview} alt="Comprobante de pago" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MisSolicitudes;